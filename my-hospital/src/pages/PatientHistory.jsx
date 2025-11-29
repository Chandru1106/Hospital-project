import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Card, CardMedia, CardContent, Grid } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const PatientHistory = () => {
    const { id } = useParams();
    const [history, setHistory] = useState([]);
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        fetchHistory();
        fetchPatient();
    }, [id]);

    const fetchHistory = async () => {
        try {
            const response = await api.get(`/consultations/patient/${id}`);
            setHistory(response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const fetchPatient = async () => {
        try {
            const response = await api.get(`/patients/${id}`);
            setPatient(response.data);
        } catch (error) {
            console.error('Error fetching patient:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Typography variant="h4">
                    Medical History: {patient?.name}
                </Typography>
                <Button variant="contained" color="primary" component={Link} to={`/consultations/new?patient_id=${id}`}>
                    New Consultation
                </Button>
            </div>

            {history.map((visit) => (
                <Paper key={visit.visit_id} sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="textSecondary">Date</Typography>
                            <Typography variant="h6">{visit.visit_date}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <Typography variant="subtitle2" color="textSecondary">Diagnosis</Typography>
                            <Typography variant="body1">{visit.diagnosis}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="textSecondary">Present History</Typography>
                            <Typography variant="body2">{visit.present_history}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="textSecondary">Treatment</Typography>
                            <Typography variant="body2">{visit.treatment}</Typography>
                        </Grid>

                        {visit.Images && visit.Images.length > 0 && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>Scans/Reports</Typography>
                                <Grid container spacing={2}>
                                    {visit.Images.map((img) => (
                                        <Grid item key={img.image_id}>
                                            <Card sx={{ maxWidth: 200 }}>
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image={`http://localhost:5000/${img.file_path.replace(/\\/g, '/')}`}
                                                    alt="Medical Scan"
                                                />
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            ))}

            {history.length === 0 && (
                <Typography variant="body1" align="center" color="textSecondary">
                    No medical history found for this patient.
                </Typography>
            )}
        </Container>
    );
};

export default PatientHistory;
