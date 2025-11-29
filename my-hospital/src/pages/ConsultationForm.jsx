import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Paper, MenuItem, Input } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const ConsultationForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preSelectedPatientId = searchParams.get('patient_id');

    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        patient_id: preSelectedPatientId || '',
        visit_date: new Date().toISOString().split('T')[0],
        present_history: '',
        diagnosis: '',
        treatment: '',
        review_date: ''
    });
    const [image, setImage] = useState(null);

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

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Create Consultation
            const response = await api.post('/consultations', formData);
            const visitId = response.data.visit_id;

            // 2. Upload Image if exists
            if (image) {
                const imageFormData = new FormData();
                imageFormData.append('image', image);
                imageFormData.append('visit_id', visitId);
                await api.post('/consultations/upload', imageFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            alert('Consultation saved successfully!');
            navigate('/appointments'); // Or back to patient list
        } catch (error) {
            console.error('Error saving consultation:', error);
            alert('Failed to save consultation');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>Doctor Consultation</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth select label="Patient" name="patient_id" value={formData.patient_id} onChange={handleChange} required>
                                {patients.map((p) => (
                                    <MenuItem key={p.patient_id} value={p.patient_id}>
                                        {p.name} (ID: {p.patient_id})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth type="date" label="Visit Date" name="visit_date" value={formData.visit_date} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField fullWidth label="Present History & Examination" name="present_history" value={formData.present_history} onChange={handleChange} multiline rows={3} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} multiline rows={2} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Treatment / Prescription" name="treatment" value={formData.treatment} onChange={handleChange} multiline rows={3} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth type="date" label="Review Date (Optional)" name="review_date" value={formData.review_date} onChange={handleChange} InputLabelProps={{ shrink: true }} helperText="Selecting a date will auto-schedule an appointment" />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" gutterBottom>Upload Scan/Report</Typography>
                            <Input type="file" onChange={handleImageChange} inputProps={{ accept: 'image/*' }} />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Button type="submit" variant="contained" color="primary" size="large">
                                Save Record
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default ConsultationForm;
