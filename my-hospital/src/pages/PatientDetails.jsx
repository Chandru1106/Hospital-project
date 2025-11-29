import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Paper, Box, TextField, Button, Divider, Card, CardContent, Chip, Avatar, IconButton } from '@mui/material';
import { ArrowBack, MedicalServices, History, MonitorHeart, Thermostat, Bloodtype, WaterDrop, UploadFile } from '@mui/icons-material';
import api from '../services/api';

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);

    const [consultationData, setConsultationData] = useState({
        present_history: '',
        diagnosis: '',
        treatment: '',
        bp: '',
        pr: '',
        temp: '',
        rbs: '',
        review_date: ''
    });

    useEffect(() => {
        fetchPatientData();
        fetchHistory();
    }, [id]);

    const fetchPatientData = async () => {
        try {
            const response = await api.get(`/patients/${id}`);
            setPatient(response.data);
        } catch (error) {
            console.error('Error fetching patient:', error);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await api.get(`/consultations/patient/${id}`);
            setHistory(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching history:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setConsultationData({
            ...consultationData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('patient_id', id);
            formData.append('visit_date', new Date().toISOString().split('T')[0]);

            Object.keys(consultationData).forEach(key => {
                formData.append(key, consultationData[key]);
            });

            if (imageFile) {
                formData.append('image', imageFile);
            }

            await api.post('/consultations', formData);

            alert('Consultation added successfully!');
            setConsultationData({
                present_history: '',
                diagnosis: '',
                treatment: '',
                bp: '',
                pr: '',
                temp: '',
                rbs: '',
                review_date: ''
            });
            setImageFile(null);
            fetchHistory();
        } catch (error) {
            console.error('Error adding consultation:', error);
            alert('Failed: ' + (error.response?.data?.error || error.message));
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (!patient) return <Typography>Patient not found</Typography>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                Back to List
            </Button>

            {/* Patient Header */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'white', color: '#10b981', fontSize: '2rem' }}>
                            {patient.name.charAt(0)}
                        </Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h4" fontWeight={700}>{patient.name}</Typography>
                        <Typography variant="subtitle1">{patient.age} Years / {patient.sex}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Mobile: {patient.mobile}</Typography>
                    </Grid>
                    <Grid item>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {patient.dm && <Chip label="DM" color="error" sx={{ bgcolor: 'white', color: '#d32f2f' }} />}
                            {patient.ht && <Chip label="HT" color="warning" sx={{ bgcolor: 'white', color: '#ed6c02' }} />}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={3}>
                {/* Add Consultation Form */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <MedicalServices color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6" fontWeight={600}>New Consultation</Typography>
                        </Box>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Present History & Examination" name="present_history" multiline rows={4} value={consultationData.present_history} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Diagnosis" name="diagnosis" multiline rows={2} value={consultationData.diagnosis} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Treatment / Rx" name="treatment" multiline rows={3} value={consultationData.treatment} onChange={handleChange} required />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Vitals</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField fullWidth size="small" label="BP (mmHg)" name="bp" value={consultationData.bp} onChange={handleChange} InputProps={{ startAdornment: <Bloodtype color="action" sx={{ mr: 1, fontSize: 20 }} /> }} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField fullWidth size="small" label="Pulse (bpm)" name="pr" value={consultationData.pr} onChange={handleChange} InputProps={{ startAdornment: <MonitorHeart color="action" sx={{ mr: 1, fontSize: 20 }} /> }} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField fullWidth size="small" label="Temp (°F)" name="temp" value={consultationData.temp} onChange={handleChange} InputProps={{ startAdornment: <Thermostat color="action" sx={{ mr: 1, fontSize: 20 }} /> }} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField fullWidth size="small" label="RBS (mg/dL)" name="rbs" value={consultationData.rbs} onChange={handleChange} InputProps={{ startAdornment: <WaterDrop color="action" sx={{ mr: 1, fontSize: 20 }} /> }} />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button variant="outlined" component="label" fullWidth startIcon={<UploadFile />}>
                                        Upload Image/Report
                                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                    </Button>
                                    {imageFile && <Typography variant="caption" display="block" sx={{ mt: 1 }}>Selected: {imageFile.name}</Typography>}
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField fullWidth type="date" label="Review Date" name="review_date" value={consultationData.review_date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 1, bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>
                                        Save Consultation
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>

                {/* History List */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minHeight: '600px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <History color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6" fontWeight={600}>Consultation History</Typography>
                        </Box>

                        {history.length === 0 ? (
                            <Typography color="text.secondary" align="center">No previous consultations found.</Typography>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {history.map((visit) => (
                                    <Card key={visit.visit_id} variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Chip label={new Date(visit.visit_date).toLocaleDateString()} color="primary" variant="outlined" size="small" />
                                                <Typography variant="caption" color="text.secondary">ID: #{visit.visit_id}</Typography>
                                            </Box>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="text.secondary">History & Examination</Typography>
                                                    <Typography variant="body1">{visit.present_history}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="text.secondary">Diagnosis</Typography>
                                                    <Typography variant="body1" fontWeight={500}>{visit.diagnosis}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="text.secondary">Treatment</Typography>
                                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{visit.treatment}</Typography>
                                                </Grid>

                                                {(visit.bp || visit.pr || visit.temp || visit.rbs) && (
                                                    <Grid item xs={12}>
                                                        <Box sx={{ display: 'flex', gap: 2, mt: 1, p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
                                                            {visit.bp && <Typography variant="caption"><strong>BP:</strong> {visit.bp}</Typography>}
                                                            {visit.pr && <Typography variant="caption"><strong>PR:</strong> {visit.pr}</Typography>}
                                                            {visit.temp && <Typography variant="caption"><strong>Temp:</strong> {visit.temp}</Typography>}
                                                            {visit.rbs && <Typography variant="caption"><strong>RBS:</strong> {visit.rbs}</Typography>}
                                                        </Box>
                                                    </Grid>
                                                )}

                                                {visit.Images && visit.Images.length > 0 && (
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Attachments</Typography>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            {visit.Images.map((img) => (
                                                                <Box
                                                                    key={img.image_id}
                                                                    component="img"
                                                                    src={`http://localhost:5000/${img.file_path}`}
                                                                    alt="Consultation Image"
                                                                    sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1, border: '1px solid #eee' }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PatientDetails;
