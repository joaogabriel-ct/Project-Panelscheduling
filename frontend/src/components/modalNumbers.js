import React from 'react';
import { CSVLink, CSVDownload } from "react-csv";

const ModalNumbersTable = ({ isOpen, onClose, numbersData }) => {
    if (!isOpen) return null;
    const numbersText = numbersData.join('\n');
    const totalNumbers = numbersData.length;
    return (
        <div style={{ zIndex: 1000 }} className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                <h2 className="text-lg font-semibold mb-4">Números</h2>
                {/* Exibe a contagem de números */}
                <p className="mb-2">Total de Números: {totalNumbers}</p>
                <label htmlFor="numbersTextarea" className="block text-sm font-medium text-gray-700">Números:</label>
                <textarea
                    id="numbersTextarea"
                    value={numbersText}
                    readOnly
                    className="mt-1 p-2 w-full h-64 border border-gray-300 rounded-md shadow-sm"
                ></textarea>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ModalNumbersTable;
