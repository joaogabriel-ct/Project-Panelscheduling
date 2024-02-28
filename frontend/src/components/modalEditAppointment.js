// Importe os módulos necessários
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '@/service/api';
import { authService } from '@/service/auth/authService';

// Define a lista de opções para o campo de seleção de status
const selectStatus = [
    { value: 'Agendado', label: 'Agendado' },
    { value: 'Em andamento', label: 'Em andamento' },
    { value: 'Finalizado', label: 'Finalizado' },
    { value: 'Com Erro', label: 'Com Erro' },
]

// Componente ModalEditAppointment
export default function ModalEditAppointment({ isOpen, onClose, appointmentData, onSave }) {
    // Defina o useFormik para gerenciar o estado do formulário
    const formik = useFormik({
        initialValues: {
            message: appointmentData.message,
            schedule_date: appointmentData.schedule_date,
            hour_schedule: appointmentData.hour_schedule.slice(0, 5),
            link: appointmentData.link,
            status: appointmentData.STATUS.status,
        },
        validationSchema: Yup.object({
            message: Yup.string().required("A mensagem do agendamento é obrigatória"),
            schedule_date: Yup.date().required("A data do agendamento é obrigatória"),
            hour_schedule: Yup.string().required('O horário é obrigatório'),
            link:Yup.string().required('O campo com o Link é obrigatório'),
            status: Yup.string().required('O status é obrigatório'),
        }),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    // Função para lidar com o envio do formulário
    const handleSubmit = async (values) => {
        const updatedData = {
            ...appointmentData,
            message: values.message,
            schedule_date: values.schedule_date,
            hour_schedule: values.hour_schedule,
            link: values.link,
            STATUS: { ...appointmentData.STATUS, status: values.status },
        };

        try {
            const response = await api.put(`/agendado/${appointmentData.id}/`, updatedData);
            onClose();
            onSave && onSave(response.data);
        } catch (error) {
            console.error('Erro ao atualizar o agendamento:', error.message);
        }
    };

    // Renderização condicional do componente com base no estado isOpen
    if (!isOpen) return null;

    return (
        <div style={{ zIndex: 1000 }} className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <form onSubmit={formik.handleSubmit}>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Editar Mailing</h3>
                    <div className="mt-2">
                        <div>
                            <label>Digite os detalhes do agendamento</label>
                            <textarea
                                name="message"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.message}
                                className="mt-2 mb-4 px-3 py-2 border rounded-md w-full"
                            />
                            {formik.touched.message && formik.errors.message && (
                                <div className="text-red-500">{formik.errors.message}</div>
                            )}
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
                                {formik.touched.schedule_date && formik.errors.schedule_date && (
                                    <div className="text-red-500">{formik.errors.schedule_date}</div>
                                )}
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label>Selecione um horário</label>
                                <input
                                    type="time"
                                    name="hour_schedule"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.hour_schedule}
                                    className="mb-4 px-3 py-2 border rounded-md w-full"
                                />
                                {formik.touched.hour_schedule && formik.errors.hour_schedule && (
                                    <div className="text-red-500">{formik.errors.hour_schedule}</div>
                                )}
                            </div>
                            <div className="w-full px-3 mb-4">
                                <label>Link do Agendamento</label>
                                <input
                                    type='text'
                                    name="link"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.link}
                                    className="mt-2 mb-4 px-3 py-2 border rounded-md w-full"
                                />  
                                {formik.touched.link && formik.errors.link && (
                                    <div className="text-red-500">{formik.errors.link}</div>
                                )}
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
                                {formik.touched.status && formik.errors.status && (
                                    <div className="text-red-500">{formik.errors.status}</div>
                                )}
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
