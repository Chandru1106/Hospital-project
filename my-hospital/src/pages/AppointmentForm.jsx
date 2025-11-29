import React, { useState, useEffect } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Grid, MenuItem, Card, CardContent, Avatar } from '@mui/material';
import { CalendarMonth, AccessTime, PersonAdd, EventAvailable } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const AppointmentForm = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        patient_id: '',
        date: '',
        time: '',
        type: 'new',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/appointments', formData);
            navigate('/appointments');
        } catch (error) {
            console.error('Error creating appointment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header with Icon */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            margin: '0 auto 16px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        <EventAvailable sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Schedule Appointment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Book a new appointment for your patient
                    </Typography>
                </Box>

                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        background: (theme) =>
                            theme.palette.mode === 'dark'
                                ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)'
                                : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                        border: (theme) =>
                            theme.palette.mode === 'dark'
                                ? '1px solid rgba(99, 102, 241, 0.2)'
                                : '1px solid rgba(99, 102, 241, 0.1)',
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Patient Selection */}
                            <Grid item xs={12}>
                                <Card
                                    sx={{
                                        background: (theme) =>
                                            theme.palette.mode === 'dark'
                                                ? 'rgba(99, 102, 241, 0.05)'
                                                : 'rgba(99, 102, 241, 0.03)',
                                        borderRadius: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <PersonAdd sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                Patient Information
                                            </Typography>
                                        </Box>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Select Patient"
                                            name="patient_id"
                                            value={formData.patient_id}
                                            onChange={handleChange}
                                            required
                                            SelectProps={{ native: true }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                },
                                            }}
                                        >
                                            <option value="">Choose a patient...</option>
                                            {patients.map((patient) => (
                                                <option key={patient.patient_id} value={patient.patient_id}>
                                                    {patient.name} - {patient.age}Y/{patient.sex}
                                                </option>
                                            ))}
                                        </TextField>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Date and Time */}
                            <Grid item xs={12}>
                                <Card
                                    sx={{
                                        background: (theme) =>
                                            theme.palette.mode === 'dark'
                                                ? 'rgba(99, 102, 241, 0.05)'
                                                : 'rgba(99, 102, 241, 0.03)',
                                        borderRadius: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <CalendarMonth sx={{ mr: 1, color: 'secondary.main' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                Appointment Schedule
                                            </Typography>
                                        </Box>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Date"
                                                    name="date"
                                                    type="date"
                                                    value={formData.date}
                                                    onChange={handleChange}
                                                    required
                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Time"
                                                    name="time"
                                                    type="time"
                                                    value={formData.time}
                                                    onChange={handleChange}
                                                    required
                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    label="Appointment Type"
                                                    name="type"
                                                    value={formData.type}
                                                    onChange={handleChange}
                                                    SelectProps={{ native: true }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                >
                                                    <option value="new">New Patient</option>
                                                    <option value="followup">Follow-up</option>
                                                    <option value="review">Review</option>
                                                    <option value="emergency">Emergency</option>
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Notes */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Additional Notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    placeholder="Any special instructions or notes..."
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    startIcon={<EventAvailable />}
                                    sx={{
                                        py: 1.8,
                                        borderRadius: 2,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #5568d3 30%, #63408b 90%)',
                                            boxShadow: '0 6px 25px rgba(102, 126, 234, 0.5)',
                                        },
                                    }}
                                >
                                    {loading ? 'Scheduling...' : 'Schedule Appointment'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default AppointmentForm;
