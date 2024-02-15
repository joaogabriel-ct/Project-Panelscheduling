
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import ModalEditAppointment from './modalEditAppointment';
import ModalView from './modalViewAppointment';
export default function Appointment({ salesData }) {
    if (!salesData || salesData.length === 0) {
        console.error('salesData não está definido ou está vazio');
        return (
            <div style={{
                margin: '20px',
                padding: '20px',
                backgroundColor: '#ffdddd',
                borderLeft: '6px solid #f44336',
                borderRadius: '5px',
                color: '#333',
            }}>
                <h2>Dados Não Disponíveis</h2>
                <p>Parece que não há dados de Agendamento disponíveis no momento.</p>
                <p>Por favor, verifique se há Agendamento registrados ou tente novamente mais tarde.</p>
                <p>Se o problema persistir, entre em contato com o suporte técnico.</p>
            </div>
        );
    }

    const customStyles = {
        rows: {
            style: {
                minHeight: '72px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("pt-BR", {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',

        });
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const handleViewClick = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
        setIsEditModalOpen(false); // Garante que apenas um modal seja aberto por vez
    };
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);

    const handleEditClick = (appointment) => {
        setEditingAppointment(appointment);
        setIsEditModalOpen(true);
    };

    const Columns = [
        {
            name: 'Nome agendamento',
            selector: row => row.campaign_name,
            sortable: true,
            cell: row => <a>{row.campaign_name}</a>
        },
        {
            name: 'Data do agendamento',
            selector: row => formatDate(row.schedule_date),
            sortable: true,
            cell: row => (
                <a>
                    {formatDate(row.schedule_date)}
                </a>
            )
        },
        {
            name: 'Criado dia:',
            selector: row => formatDate(row.created_at),
            sortable: true,
            cell: row => <a>{formatDate(row.created_at)}</a>
        },
        {
            name: 'numeros totais',
            selector: row => row.DOCUMENT.number_valid,
            sortable: true,
            cell: row => <a> {row.DOCUMENT.number_valid}</a>
        },
        {
            name: 'Ações',
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => (
                <div className="flex items-center justify-center">
                    <button
                        onClick={() => handleEditClick(row)}
                        className="mr-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                    </button>
                    <button
                        onClick={() => handleViewClick(row)}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-700 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                    </button>
                </div>
            ),
        },
    ];





    const [filterText, setFilterText] = useState('');


    const filteredItems = useMemo(() => {
        if (Array.isArray(salesData)) {
            return salesData.filter(
                item => item.campaign_name && item.campaign_name.toLowerCase().includes(filterText.toLowerCase())
            );
        }
        return []; // Retorna um array vazio se salesData não for um array
    }, [filterText, salesData]);

    return (
        <div className="p-4">
            <h2 className="bg-white text-xl font-semibold text-center mb-4">
                Agendamentos
            </h2>

            <input
                type="text"
                placeholder="Buscar..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full mb-4"
            />

            <DataTable
                columns={Columns}
                data={filteredItems}
                customStyles={customStyles}
                pagination
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10]}
            />
            {isModalOpen && selectedAppointment && (
                <ModalView
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    appointmentData={selectedAppointment}
                />
            )}

            {isEditModalOpen && editingAppointment && (
                <ModalEditAppointment
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    appointmentData={editingAppointment}
                />
            )}

        </div >
    );
}