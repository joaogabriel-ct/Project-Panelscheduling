import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { api } from '@/service/api';
import { authService } from '@/service/auth/authService';
import { useFormik } from 'formik';
import { addDays, format, isSunday } from 'date-fns';


export default function Modal({ isOpen, onClose }) {
    const hoje = new Date();
    const dataMinima = new Date(hoje.getTime() + 2 * 24 * 60 * 60 * 1000);
    const dataMinimaFormatada = dataMinima.toISOString().split('T')[0];
    const dataMaxima = addDays(new Date(), 30);
    const dataMaximaFormatada = format(dataMaxima, 'yyyy-MM-dd');
    const [disponibilidade, setDisponibilidade] = useState('');



    const validationSchema = Yup.object({
        nomeAgendamento: Yup.string().required("O nome do agendamento é obrigatório"),
        dataAgendamento: Yup.date().required("A data do agendamento é obrigatória"),
        timeAgendamento: Yup.string().required("A hora do agendamento é obrigatória"),
        arquivoAgendamento: Yup.mixed()
            .nullable()
            .required("A seleção de um arquivo é obrigatória")
            .test("fileSize", "O arquivo é muito grande", value => value && value.size <= 30000000)
            .test("fileType", "Tipo de arquivo não suportado", value => value && [
                'image/jpeg',
                'image/png',
                'video/mp4',
            ].includes(value.type)),
        telefones: Yup.string().required("A lista de telefones é obrigatória")
    });
    const verificarLimiteAgendamento = async (dataAgendamento) => {
        try {
            const response = await api.get(`/verificar-limite/?data=${dataAgendamento}`);
            if (response.status === 200) {
                const { limite, total_numeros } = response.data;
                const numerosRestantes = limite - total_numeros;
                if (numerosRestantes <= 0) {
                    return { permitido: false, numerosRestantes: 0 };
                } else {
                    return { permitido: true, numerosRestantes };
                }
            }
        } catch (error) {
            console.error('Erro ao verificar limite:', error);
            return { permitido: false, numerosRestantes: 0 };
        }
    };


    const handleDataAgendamentoBlur = async (e) => {
        formik.handleBlur(e);
        const dataSelecionada = e.target.value;
        const resultado = await verificarLimiteAgendamento(dataSelecionada);
        if (!resultado.permitido) {
            formik.setFieldError("dataAgendamento", "Não é possível agendar para esta data. Limite alcançado.");
        } else {
            formik.setErrors({ ...formik.errors, dataAgendamento: '' });
            if (resultado.numerosRestantes) {
                setDisponibilidade(`Você ainda pode agendar ${resultado.numerosRestantes} número(s) para esta data.`);
            } else if (resultado.mensagem) {
                setDisponibilidade(`${resultado.mensagem}`);
            }
        }
    };

    const formik = useFormik({
        initialValues: {
            nomeAgendamento: '',
            dataAgendamento: '',
            timeAgendamento: '',
            telefones: '',
            arquivoAgendamento: null,
        },
        validationSchema,
        onSubmit: async (values) => {

            const dataSelecionada = new Date(values.dataAgendamento);
            if (dataSelecionada.getDay() === 6) {
                alert('A data selecionada não pode ser um domingo ou já atingiu o limite de agendamentos.');
                return;
            }
            const sessionResponse = await authService.getSession();
            const session = sessionResponse.data;
            const idUser = session.user.id;
            const formDataArquivo = new FormData();
            if (values.arquivoAgendamento) {
                formDataArquivo.append('arquivoAgendamento', values.arquivoAgendamento);
                formDataArquivo.append('name', values.arquivoAgendamento.name);
                formDataArquivo.append('id_user', idUser);
            }

            try {
                const uploadResponse = await api.post('/upload/', formDataArquivo, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (uploadResponse.status === 201) {
                    const idDocument = uploadResponse.data[0].id;
                    const formDataAgendamento = new FormData();
                    formDataAgendamento.append('id_user', idUser);
                    formDataAgendamento.append('campaign_name', values.nomeAgendamento);
                    formDataAgendamento.append('schedule_date', values.dataAgendamento);
                    formDataAgendamento.append('hour_schedule', values.timeAgendamento);
                    formDataAgendamento.append('id_document', idDocument);

                    const agendamentoResponse = await api.post('/agendamento/', formDataAgendamento, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });

                    if (agendamentoResponse.status === 201) {
                        const scheduleId = agendamentoResponse.data.id;
                        const telefones = values.telefones.split('\n').map(tel => tel.trim());
                        const telefonesResponse = await api.post('/telefones/', {
                            scheduleId,
                            telefones,
                        }, {
                            headers: { 'Content-Type': 'application/json' },
                        });

                        if (telefonesResponse.status === 201) {
                            onClose(false);
                        } else {
                            throw new Error('Erro ao enviar telefones');
                        }
                    } else {
                        throw new Error(`Erro no agendamento: ${agendamentoResponse.statusText}`);
                    }
                } else {
                    throw new Error(`Erro no upload: ${uploadResponse.statusText}`);
                }
            } catch (error) {
                console.error('Falha no processo:', error.message);
                // Aqui você pode definir como deseja tratar e exibir os erros de validação para o usuário
            }
        }
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            formik.setFieldValue("arquivoAgendamento", file);
        }
    };

    if (!isOpen) return null;
    return (
        <div style={{ zIndex: 1000 }} className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center h-full w-full p-4" onClick={onClose} >
            <div className="relative bg-white border shadow-lg rounded-md w-full max-w-md mx-auto md:max-w-lg lg:max-w-xl xl:max-w-2xl p-5" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={formik.handleSubmit}>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Agendar Mailing</h3>
                    <div className="mt-2">
                        <div>
                            <label>Digite nome do agendamento</label>
                            <input
                                type="text"
                                name="nomeAgendamento"
                                placeholder="Nome do Agendamento"
                                onChange={(e) => {
                                    formik.handleChange(e);
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values.nomeAgendamento}
                                className="mt-2 mb-4 px-3 py-2 border rounded-md w-full"
                            />
                            {formik.touched.nomeAgendamento && formik.errors.nomeAgendamento ? (
                                <div className="text-red-500 text-sm">{formik.errors.nomeAgendamento}</div>
                            ) : null}
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-4">
                            <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                                <label>Selecione uma Data</label>
                                <input
                                    type="date"
                                    name="dataAgendamento"
                                    min={dataMinimaFormatada}
                                    max={dataMaximaFormatada}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                    }}
                                    onBlur={handleDataAgendamentoBlur}
                                    value={formik.values.dataAgendamento}
                                    className="mb-4 px-3 py-2 border rounded-md w-full"
                                />
                                {formik.touched.dataAgendamento && formik.errors.dataAgendamento ? (
                                    <div className="text-red-500 text-sm">{formik.errors.dataAgendamento}</div>
                                ) : null}
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label>Selecione um horario</label>
                                <input
                                    type="time"
                                    name="timeAgendamento"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.timeAgendamento}
                                    className="mb-4 px-3 py-2 border rounded-md w-full"
                                />
                                {formik.touched.timeAgendamento && formik.errors.timeAgendamento ? (
                                    <div className="text-red-500 text-sm">{formik.errors.timeAgendamento}</div>
                                ) : null}
                                <div className="text-sm mt-2">
                                    {disponibilidade}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label>Selecione um arquivo</label>
                            <input
                                type="file"
                                name="arquivoAgendamento"
                                onChange={handleFileChange}
                                onBlur={formik.handleBlur}
                                className="mt-2 mb-4 px-3 py-2 border rounded-md w-full"
                                accept="image/jpeg, image/png, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            />
                            {formik.touched.arquivoAgendamento && formik.errors.arquivoAgendamento ? (
                                <div className="text-red-500 text-sm">{formik.errors.arquivoAgendamento}</div>
                            ) : null}
                        </div>
                        <div>
                            <label htmlFor="telefones">Destinatário(s)</label>
                            <textarea
                                id="telefones"
                                name="telefones"
                                resize='none'
                                rows="10"
                                placeholder="Digite os números de telefone aqui, um por linha."
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.telefones}
                                className="border rounded-md w-full p-2"
                            />
                            {formik.touched.telefones && formik.errors.telefones ? (
                                <div className="text-red-500 text-sm">{formik.errors.telefones}</div>
                            ) : null}
                        </div>
                        <div className="mt-2">
                            {formik.values.arquivoAgendamento && Array.from(formik.values.arquivoAgendamento).map((file, index) => (
                                <div key={index} className="text-sm mt-1">
                                    {file.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-3">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 focus:outline-none"

                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
}
