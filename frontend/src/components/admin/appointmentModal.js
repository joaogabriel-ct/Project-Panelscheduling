import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import moment from 'moment';
import { api } from '@/service/api';
import Cookies from 'js-cookie';

export default function AppointmentEditModal({ appointment, onClose, onAppointmentUpdated }) {
    const csrfToken = Cookies.get('csrftoken');
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
    if (!appointment) return null;
    console.log(appointment)

    const formik = useFormik({
        initialValues: {
            status: appointment.STATUS?.status || false, // Ajustado para pegar o status do objeto STATUS, se existir
            report: null,
        },
        validationSchema: Yup.object({
            status: Yup.boolean(),
            report: Yup.mixed().required('Um arquivo é obrigatório'),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();

            // Prepara os dados de STATUS, incluindo o status booleano e, opcionalmente, o nome do arquivo
            let statusData = {
                status: values.status,
            };

            // Se um arquivo for fornecido, adiciona o nome do arquivo ao statusData e o arquivo ao formData
            if (values.report) {
                statusData.report = values.report.name; // Adiciona o nome do arquivo ao JSON para referência
                formData.append('report', values.report); // Adiciona o arquivo ao formData
            }

            // Adiciona o JSON de STATUS ao FormData
            formData.append('STATUS', JSON.stringify(statusData));

            // Adiciona outros campos necessários
            formData.append('campaign_name', appointment.campaign_name);
            formData.append('schedule_date', appointment.schedule_date);
            formData.append('hour_schedule', appointment.hour_schedule);
            formData.append('id_user', appointment.id_user.toString());
            formData.append('id_document', appointment.id_document.toString());

            try {
                const response = await api.put(`agendado/${appointment.id}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': csrfToken, // Certifique-se de que csrfToken está corretamente definido
                    },
                });
                onAppointmentUpdated(response.data);
                onClose();
            } catch (error) {
                console.error('Erro ao atualizar agendamento:', error);
            }
        }
    });

    return (
        <div style={{ zIndex: 1000 }} className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center h-full w-full p-4">
            <div className="bg-white p-8  shadow-xl max-w-lg w-full space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Detalhes do Agendamento</h3>
                <p><strong>Nome:</strong> {appointment?.campaign_name}</p>
                <p><strong>Data:</strong> {moment(appointment?.schedule_date).format('DD/MM/YYYY')}</p>
                <p><strong>Hora:</strong> {moment(appointment?.hour_schedule, 'HH:mm:ss').format('HH:mm')}</p>
                <p>
                    <strong>Arquivo enviado pelo cliente:</strong>
                    <a href={appointment?.DOCUMENT?.document_url} download className="ml-2 text-blue-500 hover:text-blue-700">
                        {appointment?.DOCUMENT?.name}
                    </a>
                </p>

                {/* Verifica se existe o campo report no appointment */}
                {appointment?.STATUS.report && (
                    <p>
                        <strong>Arquivo após a execução:</strong>
                        <a href={appointment?.STATUS.report} download className="ml-2 text-blue-500 hover:text-blue-700">
                            Relatorio de realizados
                        </a>
                    </p>
                )}

                {/* Formulário de atualização */}
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="inline-flex items-center">
                            <input type="checkbox" name="status" onChange={formik.handleChange} checked={formik.values.status} className="form-checkbox h-5 w-5 text-blue-600" />
                            <span className="ml-2 text-gray-700">Ação Concluída</span>
                        </label>
                    </div>

                    {/* Mostra o campo de upload somente se não existir o campo report */}
                    {!appointment?.STATUS.report && (
                        <div>
                            <input type="file" name="report" onChange={(event) => formik.setFieldValue("report", event.currentTarget.files[0])} className="form-input mt-1 block w-full" />
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <button onClick={onClose} className="text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">
                            Fechar
                        </button>
                        <button type="submit" className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
