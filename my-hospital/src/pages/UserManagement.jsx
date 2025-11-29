import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControlLabel, Checkbox, Avatar, Box, InputAdornment } from '@mui/material';
import { Edit, Delete, Visibility, Person, PersonAdd, Event, Search } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const UserManagement = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openBookDialog, setOpenBookDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [newPatientData, setNewPatientData] = useState({
        name: '', age: '', sex: 'Male', mobile: '', address: '', occupation: '',
        username: '', email: '', password: '', createLogin: false
    });
    const [appointmentData, setAppointmentData] = useState({
        date: '', time: '', type: 'new', notes: ''
    });
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/patients');
            if (Array.isArray(response.data)) {
                setPatients(response.data);
            } else {
                console.error('Expected array of patients, got:', response.data);
                setPatients([]);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            setPatients([]);
        }
    };

    const handleAddPatient = async () => {
        try {
            const payload = { ...newPatientData };
            if (!payload.createLogin) {
                delete payload.username;
                delete payload.email;
                delete payload.password;
            }
            await api.post('/patients', payload);
            setOpenAddDialog(false);
            fetchPatients();
            setNewPatientData({
                name: '', age: '', sex: 'Male', mobile: '', address: '', occupation: '',
                username: '', email: '', password: '', createLogin: false
            });
            alert('Patient added successfully!');
        } catch (error) {
            console.error('Error adding patient:', error);
            alert(error.response?.data?.error || 'Failed to add patient');
        }
    };

    const handleBookAppointment = async () => {
        try {
            await api.post('/appointments', {
                ...appointmentData,
                patient_id: selectedPatient.patient_id
            });
            setOpenBookDialog(false);
            alert('Appointment booked successfully!');
            setAppointmentData({ date: '', time: '', type: 'new', notes: '' });
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert(error.response?.data?.error || 'Failed to book appointment');
        }
    };

    const openBooking = (patient) => {
        setSelectedPatient(patient);
        setOpenBookDialog(true);
    };

    const handleView = (patient) => {
        setSelectedPatient(patient);
        setOpenViewDialog(true);
    };

    const handleEdit = (patient) => {
        setSelectedPatient(patient);
        setFormData(patient);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenViewDialog(false);
        setOpenDialog(false);
        setSelectedPatient(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleUpdate = async () => {
        try {
            await api.put(`/patients/${selectedPatient.patient_id}`, formData);
            setOpenDialog(false);
            fetchPatients();
            alert('Patient updated successfully!');
        } catch (error) {
            console.error('Error updating patient:', error);
            alert('Failed to update patient');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await api.delete(`/patients/${id}`);
                fetchPatients();
            } catch (error) {
                console.error('Error deleting patient:', error);
                alert('Failed to delete patient');
            }
        }
    };

    const handleNewPatientChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewPatientData({
            ...newPatientData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleAppointmentChange = (e) => {
        const { name, value } = e.target;
        setAppointmentData({
            ...appointmentData,
            [name]: value
        });
    };

    const handleRowClick = (patientId) => {
        navigate(`/patient/${patientId}`);
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.mobile.includes(searchQuery)
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        User Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage all patient profiles and user data
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={() => setOpenAddDialog(true)}
                    sx={{
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                    }}
                >
                    Add Patient
                </Button>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by Name or Mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search sx={{ color: '#94A3B8' }} />
                        </InputAdornment>
                    ),
                    sx: {
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        '& fieldset': { border: 'none' },
                    }
                }}
                sx={{ mb: 3 }}
            />

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#F8FAFC', '& th': { color: '#475569', fontWeight: 600 } }}>
                            <TableCell>Profile</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Age/Sex</TableCell>
                            <TableCell>Mobile</TableCell>
                            <TableCell>Medical Conditions</TableCell>
                            <TableCell>BPM</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPatients.map((patient) => (
                            <TableRow
                                key={patient.patient_id}
                                hover
                                onClick={() => handleRowClick(patient.patient_id)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>
                                    <Avatar sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>
                                        {patient.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{patient.name}</TableCell>
                                <TableCell>{patient.age} / {patient.sex}</TableCell>
                                <TableCell>{patient.mobile}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                        {patient.dm && <Chip label="DM" size="small" color="error" />}
                                        {patient.ht && <Chip label="HT" size="small" color="warning" />}
                                        {patient.heart_disease && <Chip label="Heart" size="small" color="error" />}
                                        {patient.thyroid_disorder && <Chip label="Thyroid" size="small" color="info" />}
                                        {patient.allergy && <Chip label="Allergy" size="small" color="secondary" />}
                                        {!patient.dm && !patient.ht && !patient.heart_disease && !patient.thyroid_disorder && !patient.allergy && (
                                            <Chip label="None" size="small" color="success" />
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {patient.current_bpm ? (
                                        <Chip label={`${patient.current_bpm} bpm`} size="small" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 600 }} />
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">--</Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <IconButton color="info" onClick={(e) => { e.stopPropagation(); handleView(patient); }} title="View Profile"><Visibility /></IconButton>
                                    <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleEdit(patient); }} title="Edit"><Edit /></IconButton>
                                    <IconButton color="secondary" onClick={(e) => { e.stopPropagation(); openBooking(patient); }} title="Book Appointment"><Event /></IconButton>
                                    <IconButton color="error" onClick={(e) => { e.stopPropagation(); handleDelete(patient.patient_id); }} title="Delete"><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Patient Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Full Name" name="name" value={newPatientData.name} onChange={handleNewPatientChange} required />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField fullWidth label="Age" name="age" type="number" value={newPatientData.age} onChange={handleNewPatientChange} required />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField fullWidth select label="Sex" name="sex" value={newPatientData.sex} onChange={handleNewPatientChange} SelectProps={{ native: true }}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Mobile" name="mobile" value={newPatientData.mobile} onChange={handleNewPatientChange} required />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Occupation" name="occupation" value={newPatientData.occupation} onChange={handleNewPatientChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Address" name="address" value={newPatientData.address} onChange={handleNewPatientChange} multiline rows={2} />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={newPatientData.createLogin} onChange={handleNewPatientChange} name="createLogin" />}
                                label="Create Login Account for Patient"
                            />
                        </Grid>
                        {newPatientData.createLogin && (
                            <>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Username" name="username" value={newPatientData.username} onChange={handleNewPatientChange} required />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Email" name="email" type="email" value={newPatientData.email} onChange={handleNewPatientChange} required />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Password" name="password" type="password" value={newPatientData.password} onChange={handleNewPatientChange} required />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddPatient} variant="contained" color="primary">Add Patient</Button>
                </DialogActions>
            </Dialog>

            {/* Book Appointment Dialog */}
            <Dialog open={openBookDialog} onClose={() => setOpenBookDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Book Appointment for {selectedPatient?.name}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Date" name="date" type="date" value={appointmentData.date} onChange={handleAppointmentChange} InputLabelProps={{ shrink: true }} required />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Time" name="time" type="time" value={appointmentData.time} onChange={handleAppointmentChange} InputLabelProps={{ shrink: true }} required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth select label="Type" name="type" value={appointmentData.type} onChange={handleAppointmentChange} SelectProps={{ native: true }}>
                                <option value="new">New Consultation</option>
                                <option value="review">Follow-up Review</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Notes" name="notes" value={appointmentData.notes} onChange={handleAppointmentChange} multiline rows={3} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBookDialog(false)}>Cancel</Button>
                    <Button onClick={handleBookAppointment} variant="contained" color="secondary">Book Appointment</Button>
                </DialogActions>
            </Dialog>

            {/* View Patient Dialog */}
            <Dialog open={openViewDialog} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white' }}>
                    Patient Profile
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedPatient && (
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            {/* Personal Info */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Person sx={{ mr: 1, color: '#10B981' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Personal Information</Typography>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                                        <Typography variant="body1" fontWeight={500}>{selectedPatient.name}</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">Age</Typography>
                                        <Typography variant="body1" fontWeight={500}>{selectedPatient.age}</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">Sex</Typography>
                                        <Typography variant="body1" fontWeight={500}>{selectedPatient.sex}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Mobile</Typography>
                                        <Typography variant="body1" fontWeight={500}>{selectedPatient.mobile}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Occupation</Typography>
                                        <Typography variant="body1" fontWeight={500}>{selectedPatient.occupation || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                                        <Typography variant="body1" fontWeight={500}>{selectedPatient.address || 'N/A'}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Medical History */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Medical History</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                    {selectedPatient.dm && <Chip label="Diabetes Mellitus" color="error" variant="outlined" />}
                                    {selectedPatient.ht && <Chip label="Hypertension" color="warning" variant="outlined" />}
                                    {selectedPatient.heart_disease && <Chip label="Heart Disease" color="error" variant="outlined" />}
                                    {selectedPatient.thyroid_disorder && <Chip label="Thyroid Disorder" color="info" variant="outlined" />}
                                    {selectedPatient.allergy && <Chip label="Allergies" color="secondary" variant="outlined" />}
                                    {!selectedPatient.dm && !selectedPatient.ht && !selectedPatient.heart_disease && !selectedPatient.thyroid_disorder && !selectedPatient.allergy && (
                                        <Typography color="text.secondary">No known medical conditions</Typography>
                                    )}
                                </Box>
                                {selectedPatient.allergy && selectedPatient.allergy_details && (
                                    <Box sx={{ mt: 1, p: 2, bgcolor: '#FFF7ED', borderRadius: 2 }}>
                                        <Typography variant="subtitle2" color="warning.main">Allergy Details:</Typography>
                                        <Typography variant="body2">{selectedPatient.allergy_details}</Typography>
                                    </Box>
                                )}
                            </Grid>

                            {/* BPM */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Vitals</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#FEE2E2' }}>
                                        <Typography variant="h5">❤️</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Current Heart Rate</Typography>
                                        <Typography variant="h5" color="error.main" fontWeight={700}>
                                            {selectedPatient.current_bpm || '--'} <Typography component="span" variant="caption">BPM</Typography>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Patient Dialog */}
            <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Edit Patient Profile</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Age"
                                name="age"
                                type="number"
                                value={formData.age || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                select
                                label="Sex"
                                name="sex"
                                value={formData.sex || 'Male'}
                                onChange={handleChange}
                                SelectProps={{ native: true }}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Mobile"
                                name="mobile"
                                value={formData.mobile || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Occupation"
                                name="occupation"
                                value={formData.occupation || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Medical History</Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={6} sm={3}>
                                    <FormControlLabel
                                        control={<Checkbox checked={formData.dm || false} onChange={handleChange} name="dm" />}
                                        label="Diabetes"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <FormControlLabel
                                        control={<Checkbox checked={formData.ht || false} onChange={handleChange} name="ht" />}
                                        label="Hypertension"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <FormControlLabel
                                        control={<Checkbox checked={formData.heart_disease || false} onChange={handleChange} name="heart_disease" />}
                                        label="Heart Disease"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <FormControlLabel
                                        control={<Checkbox checked={formData.thyroid_disorder || false} onChange={handleChange} name="thyroid_disorder" />}
                                        label="Thyroid"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox checked={formData.allergy || false} onChange={handleChange} name="allergy" />}
                                        label="Allergies"
                                    />
                                </Grid>
                                {formData.allergy && (
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Allergy Details"
                                            name="allergy_details"
                                            value={formData.allergy_details || ''}
                                            onChange={handleChange}
                                            multiline
                                            rows={2}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Vitals</Typography>
                            <TextField
                                fullWidth
                                label="Current Heart Rate (BPM)"
                                name="current_bpm"
                                type="number"
                                value={formData.current_bpm || ''}
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment: <Typography variant="caption" color="text.secondary">BPM</Typography>
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleUpdate} variant="contained" color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserManagement;
