import Modal from "@/components/dialogAppointment";
import Appointment from "@/components/tableCustomers";

const { api } = require("@/service/api");
const { useState, useEffect } = require("react");

function Dashboard(session) {
  const [data, setData] = useState({ appointment: [] });
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    api.get('agendamento/')
      .then(response => {
        console.log('resposta da API:', response)
        setData(response.data);
      })
      .catch(error => {
        console.log(error)
      })
  }, [session]);


  return (
    <div className="container px-4 py-8 mx-8 my-8 bg-white border rounded-md">
        <div className="flex justify-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
            onClick={openModal}
          >
            Novo agendamento
          </button>

          <Modal isOpen={isModalOpen} onClose={closeModal}/>
        </div>
      
      <div>
        <Appointment salesData={data} />
      </div>

    </div>
  )

}
export default Dashboard