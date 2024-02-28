import AppointmentAdmin from "@/components/admin/tableAdmin";
import { api } from "@/service/api";
import { withSuperUserHOC } from "@/service/auth/session";
import { tokenService } from "@/service/auth/tokenService";
import { useEffect, useState } from "react";


function getAccessToken(ctx) {
    return tokenService.get(ctx);
  }

function DashboardAdmin({session}) {
    const [events, setEvents] = useState([]);
    const token = getAccessToken(session)

    useEffect(() => {
        api.get('agendamento/',{
            headers:{
              Authorization: `Bearer ${token}`
            }
          })
            .then(response => {
                const appointments = response.data.map(appointment => ({
                    ...appointment,
                    start: new Date(appointment.schedule_date + 'T' + appointment.hour_schedule),
                    end: new Date(appointment.schedule_date + 'T' + appointment.hour_schedule),
                    title: `${appointment.DOCUMENT.name}`,
                }));
                setEvents(appointments);
            })
            .catch(error => {
                console.error('Erro ao buscar agendamentos:', error);
            });
    }, []);


    return (
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-full sm:max-w-md lg:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl bg-white border rounded-md">
            <AppointmentAdmin salesData={events}
            />
        </div>
    )
}

export default withSuperUserHOC(DashboardAdmin)