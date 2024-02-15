import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/pt-br';
import AppointmentDetailsModal from './appointmentModal';
import AppointmentAdmin from './tableAdmin';
import { api } from '@/service/api';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const App = () => {
    const [events, setEvents] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        api.get('http://localhost:8000/api/v1/agendamento/')
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

    const handleEventClick = (event) => {
        setSelectedAppointment(event);
    };

    return (

        <div className="App" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '80vh', margin: '25px', padding: '25px', backgroundColor: 'white' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleEventClick}
                style={{ height: 500 }}
            />
            <div>
                <div className='w-full m-8 border rounded-md shadow-xl'>
                    <AppointmentDetailsModal
                        appointment={selectedAppointment}
                        onClose={() => setSelectedAppointment(null)}
                    />
                </div>
                <div className=" w-full h-full m-8 border rounded-md shadow-xl">
                    <AppointmentAdmin
                        salesData={events}
                    />

                </div>
            </div>
        </div>
    );
};

export default App;