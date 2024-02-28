const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("pt-BR", {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',

    });
};


export default function ModalView({ isOpen, onClose, appointmentData }) {
    const numbersText = appointmentData?.telefones.join('\n');

    if (!isOpen) return null;
    return (
            <div style={{ zIndex: 1000 }} className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
                    <h3 className="font-bold text-lg">Detalhes do Agendamento</h3>
                    <div className="mt-2">
                        <textarea
                            className="w-full h-20 px-3 py-2 border rounded-md"
                            value={appointmentData?.message}
                            readOnly
                        />
                        <p>link: {appointmentData?.link}</p>
                        <p>Data do Agendamento: {appointmentData ? formatDate(appointmentData.schedule_date) : ''}</p>
                        <h2><strong>Status do agendamento </strong></h2>
                        <p>Ocorreu: {appointmentData?.STATUS?.status}</p>
                        <h2><strong>Detalhes do Documento </strong></h2>
                        <a href={appointmentData?.DOCUMENT?.document_url}
                            download={appointmentData?.DOCUMENT?.document}
                            className="ml-2 text-blue-500 hover:text-blue-700">
                            Arquivo de mídia
                        </a>
                        <textarea
                            className="w-full h-20 px-3 py-2 border rounded-md"
                            value={numbersText}
                            readOnly
                        />
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 focus:outline-none"
                    >
                        Fechar
                    </button>
                </div>

            </div>
    );
}