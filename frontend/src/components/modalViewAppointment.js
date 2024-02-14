const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("pt-BR", {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',

    });
};
export default function ModalView({ isOpen, onClose, appointmentData }) {
    if (!isOpen) return null;

    return (
        <div style={{ zIndex: 1000 }} className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
                <h3 className="font-bold text-lg">Detalhes do Agendamento</h3>
                <div className="mt-2">
                    <p>Criado em: {appointmentData ? formatDate(appointmentData.created_at) : ''}</p>
                    <p>Nome do Agendamento: {appointmentData?.campaign_name}</p>
                    <p>Data do Agendamento: {appointmentData ? formatDate(appointmentData.schedule_date) : ''}</p>
                    <h2><strong>Status do agendamento </strong></h2>
                    <p>Ocorreu: {appointmentData?.STATUS.status}</p>
                    <p>detalhes: {appointmentData?.STATUS.reported}</p>
                    <h2><strong>Detalhes do Documento </strong></h2>
                    <p>nome do arquivo: {appointmentData?.DOCUMENT.name}</p>
                    <p>Total de numeros: {appointmentData?.DOCUMENT.number}</p>
                    <p>Total de numeros validos: {appointmentData?.DOCUMENT.number_valid}</p>
                    <p>Total de numeros invalidos: {appointmentData?.DOCUMENT.number_invalid}</p>
                    <p>Total de numeros bloqueados: {appointmentData?.DOCUMENT.number_blockeds}</p>
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
