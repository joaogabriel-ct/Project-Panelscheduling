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
    
    if (!isOpen) return null;

    const validationSchema = Yup.object({
        nomeAgendamento: Yup.string().required("O nome do agendamento é obrigatório"),
        dataAgendamento: Yup.date().required("A data do agendamento é obrigatória"),
        timeAgendamento: Yup.string().required("A hora do agendamento é obrigatória"),
        arquivoAgendamento: Yup.array().of(
            Yup.mixed()
                .test(
                    "fileType",
                    "Um ou mais tipos de arquivos não são suportados",
                    value => value && ['text/plain', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(value.type)
                )
        ).required("A seleção de um arquivo é obrigatória").nullable(),
    });

    

    const formik = useFormik({
        initialValues: {
            nomeAgendamento: '',
            dataAgendamento: '',
            timeAgendamento: '',
            arquivoAgendamento: [],
        },
        validationSchema,
        onSubmit: async (values) => {
            const dataSelecionada = new Date(values.dataAgendamento);
            if (dataSelecionada.getDay() === 0) {
                alert('A data selecionada não pode ser um domingo.');
                return; // Interrompe a execução do onSubmit
            }
            const formData = new FormData();
            const sessionResponse = await authService.getSession();
            const session = sessionResponse.data; // Supondo que a resposta tenha um campo .data
            const idUser = session.user.id;
            values.arquivoAgendamento.forEach((file, index) => {
                formData.append('arquivoAgendamento', file);
                formData.append(`name`, file.name);
            });
            formData.append('id_user', idUser);

            try {
                const uploadResponse = await api.post('/upload/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (uploadResponse.status !== 201) {
                    throw new Error(`Erro no upload: ${uploadResponse.statusText}`);
                }
                const uploadResult = uploadResponse.data;
                const idDocument = uploadResult[0].id;
                const restanteDados = {
                    campaign_name: values.nomeAgendamento,
                    schedule_date: values.dataAgendamento,
                    hour_schedule: values.timeAgendamento,
                    id_user: idUser,
                    id_document: idDocument,
                };
                const dadosResponse = await api.post('/agendamento/', restanteDados, {
                    headers: { 'Content-Type': 'application/json' },
                });
                if (dadosResponse.status !== 200) {
                    throw new Error(`Erro ao enviar os dados restantes: ${dadosResponse.statusText}`);
                }

                onClose(true); 
            } catch (error) {
                console.error('Falha no processo:', error.message);
            }
        },
    });

    const handleFileChange = (event) => {
        const files = event.target.files;
        const allFiles = formik.values.arquivoAgendamento.concat(Array.from(files));
        formik.setFieldValue("arquivoAgendamento", allFiles);
    };
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.nomeAgendamento}
                                className="mt-2 mb-4 px-3 py-2 border rounded-md w-full"
                            />
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-4">
                            <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                                <label>Selecione uma Data</label>
                                <input
                                    type="date"
                                    name="dataAgendamento"
                                    min={dataMinimaFormatada}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.dataAgendamento}
                                    className="mb-4 px-3 py-2 border rounded-md w-full"
                                />
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
                                accept=".txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                multiple
                            />
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
