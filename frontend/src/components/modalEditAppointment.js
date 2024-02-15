import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '@/service/api';
import { authService } from '@/service/auth/authService';


// Componente ModalEditAppointment
export default function ModalEditAppointment({ isOpen, onClose, appointmentData, onSave }) {

    const formik = useFormik({
        initialValues: {
            nomeAgendamento: appointmentData?.campaign_name || '',
            dataAgendamento: appointmentData?.schedule_date || '',
            timeAgendamento: appointmentData?.hour_schedule ? appointmentData.hour_schedule.slice(0, 5) : '',
        },
        validationSchema: Yup.object({
            nomeAgendamento: Yup.string().required("O nome do agendamento é obrigatório"),
            dataAgendamento: Yup.date().required("A data do agendamento é obrigatória"),
            timeAgendamento: Yup.string().required('O campo de horario é obrigatório')
        }),
        onSubmit: async (values) => {
            try {
                const sessionResponse = await authService.getSession();
                const session = sessionResponse.data; 
                const idUser = session.user.id;
                console.log(appointmentData)
                const formData = new FormData();
                formData.append('campaign_name', values.nomeAgendamento);
                formData.append('schedule_date', values.dataAgendamento);
                formData.append('hour_schedule', values.timeAgendamento);
                formData.append('id_document', appointmentData.DOCUMENT.id)
                formData.append('id_user', idUser)
                const putResponse = await api.put(`/agendado/${appointmentData.id}/`, formData);

            } catch (error) {
                console.error('Falha no processo:', error.message);
            }
        },
    });

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
