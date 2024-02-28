import Appointment from "@/components/tableCustomers";
import { api } from "@/service/api";
import { withSession, withSessionHOC } from "@/service/auth/session";
import { tokenService } from "@/service/auth/tokenService";
import { redirect } from "next/dist/server/api-utils";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';


function getAccessToken(ctx) {
  return tokenService.get(ctx);
}

function Dashboard({session}) {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const token = getAccessToken(session)

  useEffect(() => {
    api.get('agendamento/',{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error)
      })
  }, [session]);

  if (!session) {
    Swal.fire({
        title: 'Usuário não autenticado',
        text: 'Faça login para ver esta página.',
        icon: 'warning',
        confirmButtonText: 'OK'
    });
    return null; 
}

  return (
    <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-full sm:max-w-md lg:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl bg-white border rounded-md oveflow-y-auto">
      <div>
        <Appointment salesData={data} />
      </div>
    </div>
  )
}


export default withSessionHOC(Dashboard);
