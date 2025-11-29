import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Grid, Card, CardContent, Chip, Alert, FormControlLabel, Checkbox, Avatar } from '@mui/material';
import { Save, Person, LocalHospital } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../services/api';

const MyProfile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        sex: 'Male',
        address: '',
        mobile: '',
        occupation: '',
        dm: false,
        ht: false,
        heart_disease: false,
        thyroid_disorder: false,
        allergy: false,
        allergy_details: '',
        current_bpm: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [hasProfile, setHasProfile] = useState(false);

    useEffect(() => {
        if (user?.role !== 'admin') {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/patients/my-profile');
            setFormData(response.data);
            setHasProfile(true);
        } catch (error) {
            if (error.response?.status === 404) {
                setHasProfile(false);
            }
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
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        setLoading(true);
        setMessage({ type: '', text: '' });

        // Validate Mobile Number
        if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
            setMessage({ type: 'error', text: 'Mobile number must be exactly 10 digits' });
            setLoading(false);
            return;
        }

        try {
            if (hasProfile) {
                await api.put('/patients/my-profile', formData);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                await api.post('/patients/my-profile', formData);
                setMessage({ type: 'success', text: 'Profile created successfully!' });
                setHasProfile(true);
            }
            fetchProfile();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to save profile' });
        } finally {
            setLoading(false);
        }
    };

    if (user?.role === 'admin') {
        return (
            <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card
                        elevation={6}
                        sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            background: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                                p: 6,
                                textAlign: 'center',
                                color: 'white',
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    margin: '0 auto 20px',
                                    bgcolor: '#3B82F6',
                                    fontSize: '3.5rem',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                    border: '4px solid white'
                                }}
                            >
                                {user?.username?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                                {user?.username}
                            </Typography>
                            <Chip
                                label="Administrator"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontWeight: 600,
                                    px: 2,
                                    py: 0.5
                                }}
                            />
                        </Box>
                        <CardContent sx={{ p: 4 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            Email Address
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600} color="text.primary">
                                            {user?.email}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            System Role
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600} color="text.primary">
                                            Full Access Administrator
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </motion.div>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <Box
                    sx={{
                        textAlign: 'center',
                        mb: 4,
                        mx: 1.5,
                        p: 4,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.1)',
                    }}
                >
                    <Avatar
                        sx={{
                            width: 120,
                            height: 120,
                            margin: '0 auto 20px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            fontSize: '3.5rem',
                            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                        }}
                    >
                        {formData.name ? formData.name.charAt(0).toUpperCase() : <Person sx={{ fontSize: 60 }} />}
                    </Avatar>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, background: 'linear-gradient(45deg, #10b981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {hasProfile ? 'My Medical Profile' : 'Complete Your Profile'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {hasProfile ? 'View and update your medical information' : 'Fill in your details to get started with personalized care'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Chip
                            label={user?.username || 'Patient'}
                            sx={{
                                fontSize: '0.9rem',
                                px: 1,
                                background: 'linear-gradient(45deg, #10b981, #059669)',
                                color: 'white'
                            }}
                            icon={<Person sx={{ color: 'white !important' }} />}
                        />
                        <Chip
                            label={hasProfile ? 'Profile Complete' : 'Setup Required'}
                            color={hasProfile ? 'success' : 'warning'}
                            sx={{ fontSize: '0.9rem', px: 1 }}
                        />
                    </Box>
                </Box>

                {message.text && (
                    <Alert severity={message.type} sx={{ mb: 3, mx: 1.5 }}>
                        {message.text}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Personal Information */}
                        <Grid item xs={12}>
                            <Card
                                elevation={4}
                                sx={{
                                    borderRadius: 4,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    sx={{
                                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                        p: 3,
                                        color: 'white',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Person sx={{ mr: 1.5, fontSize: 32 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            Personal Information
                                        </Typography>
                                    </Box>
                                </Box>
                                <CardContent sx={{ p: 4 }}>
                                    <Grid container spacing={2.5}>
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Age"
                                                name="age"
                                                type="number"
                                                value={formData.age}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Sex"
                                                name="sex"
                                                value={formData.sex}
                                                onChange={handleChange}
                                                SelectProps={{ native: true }}
                                                required
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Mobile Number"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Occupation"
                                                name="occupation"
                                                value={formData.occupation}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                multiline
                                                rows={2}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Medical History */}
                        <Grid item xs={12}>
                            <Card
                                elevation={4}
                                sx={{
                                    borderRadius: 4,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    sx={{
                                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                        p: 3,
                                        color: 'white',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocalHospital sx={{ mr: 1.5, fontSize: 32 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            Medical History
                                        </Typography>
                                    </Box>
                                </Box>
                                <CardContent sx={{ p: 4 }}>
                                    <Grid container spacing={2.5}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Box sx={{
                                                p: 2,
                                                borderRadius: 3,
                                                border: '2px solid',
                                                borderColor: formData.dm ? '#10B981' : '#E5E7EB',
                                                bgcolor: formData.dm ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                                transition: 'all 0.2s',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    borderColor: '#10B981',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                                                }
                                            }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formData.dm}
                                                            onChange={handleChange}
                                                            name="dm"
                                                            sx={{
                                                                color: '#10B981',
                                                                '&.Mui-checked': {
                                                                    color: '#10B981',
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                            Diabetes Mellitus
                                                        </Typography>
                                                    }
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Box sx={{
                                                p: 2,
                                                borderRadius: 3,
                                                border: '2px solid',
                                                borderColor: formData.ht ? '#10B981' : '#E5E7EB',
                                                bgcolor: formData.ht ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                                transition: 'all 0.2s',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    borderColor: '#10B981',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                                                }
                                            }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formData.ht}
                                                            onChange={handleChange}
                                                            name="ht"
                                                            sx={{
                                                                color: '#10B981',
                                                                '&.Mui-checked': {
                                                                    color: '#10B981',
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                            Hypertension
                                                        </Typography>
                                                    }
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Box sx={{
                                                p: 2,
                                                borderRadius: 3,
                                                border: '2px solid',
                                                borderColor: formData.heart_disease ? '#10B981' : '#E5E7EB',
                                                bgcolor: formData.heart_disease ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                                transition: 'all 0.2s',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    borderColor: '#10B981',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                                                }
                                            }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formData.heart_disease}
                                                            onChange={handleChange}
                                                            name="heart_disease"
                                                            sx={{
                                                                color: '#10B981',
                                                                '&.Mui-checked': {
                                                                    color: '#10B981',
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                            Heart Disease
                                                        </Typography>
                                                    }
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Box sx={{
                                                p: 2,
                                                borderRadius: 3,
                                                border: '2px solid',
                                                borderColor: formData.thyroid_disorder ? '#10B981' : '#E5E7EB',
                                                bgcolor: formData.thyroid_disorder ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                                transition: 'all 0.2s',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    borderColor: '#10B981',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                                                }
                                            }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formData.thyroid_disorder}
                                                            onChange={handleChange}
                                                            name="thyroid_disorder"
                                                            sx={{
                                                                color: '#10B981',
                                                                '&.Mui-checked': {
                                                                    color: '#10B981',
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                            Thyroid Disorder
                                                        </Typography>
                                                    }
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Box sx={{
                                                p: 2,
                                                borderRadius: 3,
                                                border: '2px solid',
                                                borderColor: formData.allergy ? '#10B981' : '#E5E7EB',
                                                bgcolor: formData.allergy ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                                transition: 'all 0.2s',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    borderColor: '#10B981',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                                                }
                                            }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formData.allergy}
                                                            onChange={handleChange}
                                                            name="allergy"
                                                            sx={{
                                                                color: '#10B981',
                                                                '&.Mui-checked': {
                                                                    color: '#10B981',
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                            Allergies
                                                        </Typography>
                                                    }
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    {formData.allergy && (
                                        <Box sx={{ mt: 3 }}>
                                            <TextField
                                                fullWidth
                                                label="Allergy Details"
                                                name="allergy_details"
                                                value={formData.allergy_details}
                                                onChange={handleChange}
                                                multiline
                                                rows={3}
                                                placeholder="Please specify your allergies..."
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 3,
                                                        '&:hover fieldset': {
                                                            borderColor: '#10B981',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#10B981',
                                                        },
                                                    },
                                                }}
                                            />
                                        </Box>
                                    )}

                                    {/* BPM Input Section */}
                                    <Box sx={{ mt: 4, pt: 4, borderTop: '2px solid #E5E7EB' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 3 }}>
                                            Current Heart Rate (BPM)
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Heart Rate (BPM)"
                                                    name="current_bpm"
                                                    type="number"
                                                    value={formData.current_bpm || ''}
                                                    onChange={handleChange}
                                                    placeholder="e.g., 72"
                                                    InputProps={{
                                                        inputProps: { min: 40, max: 200 }
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 3,
                                                            '&:hover fieldset': {
                                                                borderColor: '#EF4444',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#EF4444',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            {formData.current_bpm && (
                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{
                                                        p: 3,
                                                        borderRadius: 3,
                                                        background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                                                        border: '2px solid #EF4444',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2
                                                    }}>
                                                        <Box sx={{
                                                            p: 2,
                                                            borderRadius: 2,
                                                            bgcolor: 'background.paper'
                                                        }}>
                                                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#EF4444' }}>
                                                                ❤️
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="caption" sx={{ color: '#991B1B', fontWeight: 600 }}>
                                                                Current BPM
                                                            </Typography>
                                                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#DC2626' }}>
                                                                {formData.current_bpm}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </form>

                {/* Create/Update Profile Button - Separate Section */}
                <Box sx={{ mt: 4, mx: 1.5 }}>
                    <Card
                        elevation={6}
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
                            border: '2px solid',
                            borderColor: 'rgba(16, 185, 129, 0.2)',
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#2C3E50' }}>
                                    {hasProfile ? 'Update Your Profile' : 'Complete Your Profile Setup'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    {hasProfile
                                        ? 'Click below to save your updated information'
                                        : 'Click below to create your medical profile and get started'}
                                </Typography>
                                <Button
                                    fullWidth
                                    onClick={handleSubmit}
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    startIcon={<Save />}
                                    sx={{
                                        py: 1.8,
                                        borderRadius: 2,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
                                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #059669 30%, #047857 90%)',
                                            boxShadow: '0 6px 25px rgba(16, 185, 129, 0.5)',
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {loading ? 'Saving...' : hasProfile ? 'Update Profile' : 'Create Profile'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </motion.div>
        </Container>
    );
};

export default MyProfile;
