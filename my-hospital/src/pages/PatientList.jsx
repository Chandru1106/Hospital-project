import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip } from '@mui/material';
import { Add, Edit, Delete, History, Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

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

    const handleDelete = async (id) => {
        if (!isAdmin) {
            alert('You do not have permission to delete patients');
            return;
        }

        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await api.delete(`/patients/${id}`);
                fetchPatients();
            } catch (error) {
                console.error('Error deleting patient:', error);
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                        Patient Records
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {isAdmin ? 'Manage all patient information' : 'View patient records'}
                    </Typography>
                </div>
                {isAdmin && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        component={Link}
                        to="/patients/new"
                        sx={{
                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #5568d3 30%, #63408b 90%)',
                            },
                        }}
                    >
                        Add Patient
                    </Button>
                )}
            </div>

            <TableContainer
                component={Paper}
                elevation={3}
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: (theme) => theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc' }}>
                            <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Age/Sex</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Mobile</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow
                                key={patient.patient_id}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
                                    },
                                }}
                            >
                                <TableCell>
                                    <Chip label={`#${patient.patient_id}`} size="small" color="primary" variant="outlined" />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{patient.name}</TableCell>
                                <TableCell>{patient.age} / {patient.sex}</TableCell>
                                <TableCell>{patient.mobile}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="info"
                                        component={Link}
                                        to={`/patients/${patient.patient_id}/history`}
                                        title="View History"
                                    >
                                        {isAdmin ? <History /> : <Visibility />}
                                    </IconButton>
                                    {isAdmin && (
                                        <>
                                            <IconButton
                                                color="primary"
                                                component={Link}
                                                to={`/patients/edit/${patient.patient_id}`}
                                                title="Edit"
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(patient.patient_id)}
                                                title="Delete"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {!isAdmin && (
                <Paper sx={{ mt: 3, p: 2, background: (theme) => theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)' }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Note:</strong> As a patient, you have view-only access. Contact an administrator for any changes.
                    </Typography>
                </Paper>
            )}
        </Container>
    );
};

export default PatientList;
