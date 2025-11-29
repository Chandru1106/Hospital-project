import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Grid, FormControlLabel, Checkbox, Paper, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const PatientForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        sex: '',
        address: '',
        mobile: '',
        occupation: '',
        dm: false,
        ht: false,
        heart_disease: false,
        thyroid_disorder: false,
        allergy: false,
        allergy_details: ''
    });

    useEffect(() => {
        if (isEdit) {
            fetchPatient();
        }
    }, [id]);

    const fetchPatient = async () => {
        try {
            const response = await api.get(`/patients/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching patient:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/patients/${id}`, formData);
            } else {
                await api.post('/patients', formData);
            }
            navigate('/patients');
        } catch (error) {
            console.error('Error saving patient:', error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {isEdit ? 'Edit Patient' : 'New Patient'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField fullWidth select label="Sex" name="sex" value={formData.sex} onChange={handleChange} required>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} multiline rows={2} />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>Medical History</Typography>
                            <FormControlLabel control={<Checkbox checked={formData.dm} onChange={handleChange} name="dm" />} label="Diabetes (DM)" />
                            <FormControlLabel control={<Checkbox checked={formData.ht} onChange={handleChange} name="ht" />} label="Hypertension (HT)" />
                            <FormControlLabel control={<Checkbox checked={formData.heart_disease} onChange={handleChange} name="heart_disease" />} label="Heart Disease" />
                            <FormControlLabel control={<Checkbox checked={formData.thyroid_disorder} onChange={handleChange} name="thyroid_disorder" />} label="Thyroid Disorder" />
                            <FormControlLabel control={<Checkbox checked={formData.allergy} onChange={handleChange} name="allergy" />} label="Allergy" />
                        </Grid>

                        {formData.allergy && (
                            <Grid item xs={12}>
                                <TextField fullWidth label="Allergy Details" name="allergy_details" value={formData.allergy_details} onChange={handleChange} />
                            </Grid>
                        )}

                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Button type="submit" variant="contained" color="primary" size="large">
                                Save Patient
                            </Button>
                            <Button variant="outlined" color="secondary" sx={{ ml: 2 }} onClick={() => navigate('/patients')}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default PatientForm;
