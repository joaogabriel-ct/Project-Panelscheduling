import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import ModalEditAppointment from '../modalEditAppointment';
import ModalView from '../modalViewAppointment';
import ModalNumbersTable from '../modalNumbers';


const DateInputWrapper = styled.div`
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 12px;
  margin-right: 8px;

  label {
    margin-right: 10px;
  }

  input[type="date"] {
    border: none;
    outline: none;
    padding: 4px;
    margin-right: 4px;
  }
`;

const DateInput = ({ label, value, onChange }) => {
    return (
        <DateInputWrapper>
            <label>{label}</label>
            <input type="date" value={value} onChange={onChange} />
        </DateInputWrapper>
    );
};

const selectStatus = [
    { value: '1', label: 'Agendado' },
    { value: '2', label: 'Em andamento' },
    { value: '3', label: 'Finalizado' },
    { value: '4', label: 'Com Erro' },
];

const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("pt-BR", {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',

    });
};

export default function AppointmentAdmin({ salesData }) {
    const [filterText, setFilterText] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [isNumbersModalOpen, setIsNumbersModalOpen] = useState(false);
    const [currentNumbersData, setCurrentNumbersData] = useState([]);

    const handleViewClick = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
        setIsEditModalOpen(false);
    };

    const handleEditClick = (appointment) => {
        setEditingAppointment(appointment);
        setIsEditModalOpen(true);
    };

    const handleNumbersClick = (appointment) => {
        setCurrentNumbersData(appointment);
        setIsNumbersModalOpen(true);
    };

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
    const Columns = [
        {
            name: 'Campanha',
            selector: row => row.campaign_name,
            sortable: true,
            cell: row => <a >{row.campaign_name}</a>
        },
        {
            name: 'Agendado por:',
            selector: row => row.USER.username,
            sortable: true,
            cell: row => <a>{row.USER.username}</a>
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
            name: 'Status',
            selector: row => row.STATUS?.status,
            sortable: true,
            cell: row => <a > {row.STATUS?.status}</a>
        },
        {
            name: 'numeros totais',
            selector: row => row.number_valid,
            sortable: true,
            cell: row => <a onClick={() => handleNumbersClick(row.telefones)}>
                {row.number_valid}
            </a>
        },
        {
            name: 'Ações',
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => (
                <div className="flex justify-start border rounded-md">
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
    
    const filteredItems = useMemo(() => {
        return salesData.filter(item => {
            const matchesCampaignName = item.campaign_name.toLowerCase().includes(filterText.toLowerCase());
            const matchesStatus = statusFilter ? item.STATUS?.status === statusFilter : true;
            const itemDate = new Date(item.schedule_date).getTime();
            const start = startDate ? new Date(startDate).getTime() : null;
            const end = endDate ? new Date(endDate).getTime() : null;

            const matchesStartDate = start ? itemDate >= start : true;
            const matchesEndDate = end ? itemDate <= end : true;

            return matchesCampaignName && matchesStatus && matchesStartDate && matchesEndDate;
        });
    }, [filterText, statusFilter, startDate, endDate, salesData]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold text-center mb-4">Agendamentos</h2>
            <div className="flex flex-wrap -mx-2 mb-4">
                <div className="px-2 w-full sm:w-1/2 lg:w-1/4">
                    <input
                        type="text"
                        placeholder="Buscar por nome da campanha..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                </div>
                <div className="px-2 w-full sm:w-1/2 lg:w-1/4">
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    >
                        <option value="">Todos os Status</option>
                        {selectStatus.map(option => (
                            <option key={option.value} value={option.label}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="px-2 w-full sm:w-1/2 lg:w-1/4">
                    <DateInput label="De" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="px-2 w-full sm:w-1/2 lg:w-1/4">
                    <DateInput label="Até" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
            </div>
            <DataTable
                columns={Columns}
                data={filteredItems}
                customStyles={customStyles}
                pagination
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10]}
            />

            {
                isModalOpen && selectedAppointment && (
                    <ModalView
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        appointmentData={selectedAppointment}
                    />
                )
            }

            {
                isEditModalOpen && editingAppointment && (
                    <ModalEditAppointment
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        appointmentData={editingAppointment}
                    />
                )
            }
            {isNumbersModalOpen && (
                <div className='bg-white p-4 rounded-lg shadow-lg'>
                <ModalNumbersTable
                    isOpen={isNumbersModalOpen}
                    onClose={() => setIsNumbersModalOpen(false)}
                    numbersData={currentNumbersData}
                />
                </div>
            )}
        </div >
    );
}


/* 
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import ModalEditAppointment from '../modalEditAppointment';
import ModalView from '../modalViewAppointment';




export default function AppointmentAdmin({ salesData }) {
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
            name: 'Campanha',
            selector: row => row.campaign_name,
            sortable: true,
            cell: row => <a >{row.campaign_name}</a>
        },
        {
            name: 'Agendado por:',
            selector: row => row.USER.username,
            sortable: true,
            cell: row => <a>{row.USER.username}</a>
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
            name: 'Status',
            selector: row => row.STATUS.status,
            sortable: true,
            cell: row => <a > {row.STATUS?.status}</a>
        },
        {
            name: 'numeros totais',
            selector: row => row.number_valid,
            sortable: true,
            cell: row => <a > {row.number_valid}</a>
        },
        {
            name: 'Ações',
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => (
                <div className="flex justify-start border rounded-md">
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
} */