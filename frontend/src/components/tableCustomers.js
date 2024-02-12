import React from 'react';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';

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

const Columns = [
    {
        name: 'Nome agendamento',
        selector: row => row.campaign_name,
        sortable: true,
        cell: row => <a href={`agenda/${row.id}`}>{row.campaign_name}</a>
    },
    {
        name: 'Data do agendamento',
        selector: row => formatDate(row.schedule_date),
        sortable: true,
        cell: row => (
            <a href={`agenda/${row.id}`}>
                {formatDate(row.schedule_date)}
            </a>
        )
    },
    {
        name: 'Criado dia:',
        selector: row => formatDate(row.created_at),
        sortable: true,
        cell: row => <a href={`agenda/${row.id}`}>{formatDate(row.created_at)}</a>
    },
    {
        name: 'numeros totais',
        selector: row => row.DOCUMENT.number_valid,
        sortable: true,
        cell: row => <a href={`agenda/${row.id}`}> {row.DOCUMENT.number_valid}</a>
    },
    {
        name: 'Editar',
        selector: row => formatDate(row.sale_date),
        sortable: true,
        cell: row => <a href={`agenda/${row.id}`}>Editar</a>
    },
];

export default function Appointment({ salesData }) {
    const [filterText, setFilterText] = React.useState('');

    const filteredItems = React.useMemo(() => {
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
        </div>
    );
}