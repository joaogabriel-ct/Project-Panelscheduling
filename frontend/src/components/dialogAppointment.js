import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Modal({ isOpen, onClose }) {
    if (!isOpen) return null;

    // Esquema de validação do Yup
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

    // Função para manipular o envio do formulário
    const onSubmit = async (values) => {
        const formData = new FormData();
        formData.append('nomeAgendamento', values.nomeAgendamento);
        formData.append('dataAgendamento', values.dataAgendamento);
        formData.append('timeAgendamento', values.timeAgendamento);

        values.arquivoAgendamento.forEach((file, index) => {
            formData.append(`arquivoAgendamento[${index}]`, file);
        });

        try {
            const response = await fetch('/caminho/do/endpoint', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Sucesso:', result);
            onClose(); // Fecha o modal após o envio bem-sucedido
        } catch (error) {
            console.error('Falha no envio:', error);
        }
    };

    // Inicialização do Formik
    const formik = useFormik({
        initialValues: {
            nomeAgendamento: '',
            dataAgendamento: '',
            timeAgendamento: '',
            arquivoAgendamento: [],
        },
        validationSchema,
        onSubmit,
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
