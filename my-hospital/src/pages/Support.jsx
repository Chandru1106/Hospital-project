import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Grid } from '@mui/material';
import { Send, Email, Phone, LocationOn } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Support = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send data to backend to trigger email
            const response = await fetch('http://localhost:5000/api/support/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            p: { xs: 2, md: 4 }
        }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 5, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1E293B', mb: 2 }}>
                        Contact Support
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#64748B' }}>
                        We're here to help. Send us a message or reach out directly.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Contact Info */}
                    <Grid item xs={12} md={5}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, height: '100%', bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#1E293B' }}>
                                    Get in Touch
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                    <Box sx={{ p: 2, borderRadius: '50%', bgcolor: '#E0F2FE', mr: 3 }}>
                                        <Email sx={{ color: '#0284C7', fontSize: 28 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ color: '#64748B' }}>Email Us</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>rickychandru6@gmail.com</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                    <Box sx={{ p: 2, borderRadius: '50%', bgcolor: '#DCFCE7', mr: 3 }}>
                                        <Phone sx={{ color: '#16A34A', fontSize: 28 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ color: '#64748B' }}>Call Us</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>9976544106</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ p: 2, borderRadius: '50%', bgcolor: '#FAE8FF', mr: 3 }}>
                                        <LocationOn sx={{ color: '#9333EA', fontSize: 28 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ color: '#64748B' }}>Visit Us</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>Gowthami Doctor Clinic</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>

                    {/* Contact Form */}
                    <Grid item xs={12} md={7}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                                {submitted ? (
                                    <Box sx={{ textAlign: 'center', py: 8 }}>
                                        <Typography variant="h5" sx={{ color: '#10B981', fontWeight: 700, mb: 2 }}>
                                            Message Sent!
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#64748B' }}>
                                            Thank you for contacting us. We will get back to you shortly.
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            sx={{ mt: 4 }}
                                            onClick={() => setSubmitted(false)}
                                        >
                                            Send Another Message
                                        </Button>
                                    </Box>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1E293B' }}>
                                            Send a Message
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Your Name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Email Address"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Message"
                                                    name="message"
                                                    multiline
                                                    rows={4}
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    size="large"
                                                    fullWidth
                                                    endIcon={<Send />}
                                                    sx={{
                                                        py: 1.5,
                                                        background: 'linear-gradient(45deg, #2563EB 30%, #4F46E5 90%)',
                                                        fontSize: '1.1rem',
                                                        textTransform: 'none',
                                                        borderRadius: 2
                                                    }}
                                                >
                                                    Send Message
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                )}
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Support;
