import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '@/service/api';
import { authService } from '@/service/auth/authService';

const selectStatus = [
    { value: 'Agendado', label: 'Agendado' },
    { value: 'Em andamento', label: 'Em andamento' },
    { value: 'Finalizado', label: 'Finalizado' },
    { value: 'Com Erro', label: 'Com Erro' },
]

export default function ModalEditAppointment({ isOpen, onClose, appointmentData, onSave }) {
    const formik = useFormik({
        initialValues: {
            campaign_name: appointmentData.campaign_name,
            schedule_date: appointmentData.schedule_date,
            hour_schedule: appointmentData.hour_schedule.slice(0, 5), // Assumindo que você queira editar só a hora
            status: appointmentData.STATUS.status,
            // Inclua outros campos conforme necessário
        },
        validationSchema: Yup.object({
            campaign_name: Yup.string().required("O nome do agendamento é obrigatório"),
            schedule_date: Yup.date().required("A data do agendamento é obrigatória"),
            hour_schedule: Yup.string().required('O horário é obrigatório'),
            status: Yup.string().required('O status é obrigatório'),
            // Validações adicionais conforme necessário
        }),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    const handleSubmit = async (values) => {
        // Construindo o objeto com os valores atualizados
        const updatedData = {
            ...appointmentData,
            campaign_name: values.campaign_name,
            schedule_date: values.schedule_date,
            hour_schedule: values.hour_schedule,
            STATUS: { ...appointmentData.STATUS, status: values.status }, 
            
        };

        try {
            const response = await api.put(`/agendado/${appointmentData.id}/`, updatedData);
            // Processamento adicional conforme necessário, como fechar o modal
            onClose();
            onSave && onSave(response.data); // Se houver função onSave passada como prop, chame-a com os dados atualizados
        } catch (error) {
            console.error('Erro ao atualizar o agendamento:', error.message);
        }
    };
    /* onSubmit: async (values) => {
        const statusJson = JSON.stringify({ status: values.status });
        try {
            const sessionResponse = await authService.getSession();
            const session = sessionResponse.data;
            const idUser = session.user.id;
            console.log(appointmentData)
            const formData = new FormData();
            formData.append('campaign_name', values.nomeAgendamento);
            formData.append('schedule_date', values.dataAgendamento);
            formData.append('hour_schedule', values.timeAgendamento);
            formData.append('id_document', appointmentData.DOCUMENT.id);
            formData.append('id_user', idUser);
            formData.append('STATUS', statusJson);
            const putResponse = await api.put(`/agendado/${appointmentData.id}/`, formData);
            onClose(false);
        } catch (error) {
            console.error('Falha no processo:', error.message);
        }
    },
});
*/
    if (!isOpen) return null;

    return (
        <div style={{ zIndex: 1000 }} className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <form onSubmit={formik.handleSubmit}>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Editar Mailing</h3>
                    <div className="mt-2">
                        <div>
                            <label>Digite nome do agendamento</label>
                            <input
                                type="text"
                                name="campaign_name"
                                placeholder="Nome do Agendamento"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.campaign_name}
                                className="mt-2 mb-4 px-3 py-2 border rounded-md w-full"
                            />
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-4">
                            <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                                <label>Selecione uma Data</label>
                                <input
                                    type="date"
                                    name="schedule_date"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.schedule_date}
                                    className="mb-4 px-3 py-2 border rounded-md w-full"
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label>Selecione um horario</label>
                                <input
                                    type="time"
                                    name="hour_schedule"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.hour_schedule}
                                    className="mb-4 px-3 py-2 border rounded-md w-full"
                                />
                            </div>
                            <div className="w-full px-3 mb-4">
                                <label>Status do Agendamento</label>
                                <select
                                    name="status"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.status}
                                    className="mt-2 mb-4 px-3 py-2 border rounded-md w-full"
                                >
                                    {selectStatus.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-end space-x-4 mt-3">
                        <button
                            type="button"
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 focus:outline-none"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 focus:outline-none"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
