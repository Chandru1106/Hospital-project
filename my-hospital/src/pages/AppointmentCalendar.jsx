import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Button, Grid } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AppointmentCalendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            const formattedEvents = response.data.map(apt => ({
                id: apt.appointment_id,
                title: `${apt.Patient.name} (${apt.type})`,
                start: `${apt.date}T${apt.time}`,
                backgroundColor: apt.type === 'new' ? '#3788d8' : '#28a745', // Blue for new, Green for review
                extendedProps: { ...apt }
            }));
            setEvents(formattedEvents);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Typography variant="h4">Appointments</Typography>
                <Button variant="contained" startIcon={<Add />} component={Link} to="/appointments/new">
                    New Appointment
                </Button>
            </div>
            <Paper sx={{ p: 2 }}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    height="auto"
                />
            </Paper>
        </Container>
    );
};

export default AppointmentCalendar;
