import Appointment from "@/components/tableCustomers";



const { api } = require("@/service/api");
const { useState, useEffect } = require("react");

function Dashboard(session) {
  const [data, setData] = useState({ appointment: [] });
  const [error, setError] = useState('');
  

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
    <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-full sm:max-w-md lg:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl bg-white border rounded-md">
      <div>
        <Appointment salesData={data} />
      </div>
    </div>
  )
}

export default Dashboard;
