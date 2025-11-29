import React from 'react';
import { Container, Typography, Box, Paper, Grid, Avatar, Chip, Divider } from '@mui/material';
import { Code, GitHub, LinkedIn, Language, VerifiedUser } from '@mui/icons-material';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            p: { xs: 2, md: 4 }
        }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1E293B', mb: 2 }}>
                        About The Project
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#64748B', maxWidth: '800px', mx: 'auto' }}>
                        A comprehensive Hospital Management System designed to streamline patient care and administrative workflows.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Developer Info */}
                    <Grid item xs={12} md={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center', height: '100%' }}>
                                <Avatar
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        mx: 'auto',
                                        mb: 3,
                                        bgcolor: '#3B82F6',
                                        fontSize: '3rem'
                                    }}
                                >
                                    RC
                                </Avatar>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
                                    rickychandru6@gmail.com
                                </Typography>
                                <Chip
                                    label="Lead Developer"
                                    color="primary"
                                    size="small"
                                    sx={{ mb: 3, fontWeight: 600 }}
                                />
                                <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>
                                    Full-stack developer passionate about building intuitive and impactful web applications.
                                </Typography>

                                <Divider sx={{ my: 3 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1, borderRadius: '50%', bgcolor: '#F1F5F9', cursor: 'pointer', '&:hover': { bgcolor: '#E2E8F0' } }}>
                                        <GitHub sx={{ color: '#333' }} />
                                    </Box>
                                    <Box sx={{ p: 1, borderRadius: '50%', bgcolor: '#E0F2FE', cursor: 'pointer', '&:hover': { bgcolor: '#BAE6FD' } }}>
                                        <LinkedIn sx={{ color: '#0077B5' }} />
                                    </Box>
                                    <Box sx={{ p: 1, borderRadius: '50%', bgcolor: '#F0FDF4', cursor: 'pointer', '&:hover': { bgcolor: '#DCFCE7' } }}>
                                        <Language sx={{ color: '#16A34A' }} />
                                    </Box>
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>

                    {/* Project Details */}
                    <Grid item xs={12} md={8}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Paper elevation={3} sx={{ p: 4, borderRadius: 4, height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <VerifiedUser sx={{ color: '#10B981', fontSize: 32, mr: 2 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                        Project Overview
                                    </Typography>
                                </Box>

                                <Typography variant="body1" sx={{ color: '#475569', mb: 4, lineHeight: 1.8 }}>
                                    This Hospital Management System is built with a modern tech stack to ensure performance, security, and scalability. It features role-based access control, real-time health tracking, and efficient appointment management.
                                </Typography>

                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 2 }}>
                                    Key Technologies
                                </Typography>

                                <Grid container spacing={2} sx={{ mb: 4 }}>
                                    {['React.js', 'Node.js', 'Express', 'SQLite', 'Material UI', 'Framer Motion'].map((tech) => (
                                        <Grid item key={tech}>
                                            <Chip
                                                icon={<Code sx={{ fontSize: '1rem !important' }} />}
                                                label={tech}
                                                sx={{
                                                    bgcolor: '#F8FAFC',
                                                    border: '1px solid #E2E8F0',
                                                    fontWeight: 600,
                                                    color: '#475569'
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>

                                <Box sx={{ bgcolor: '#F8FAFC', p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                                    <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 1 }}>
                                        Version Information
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                                            Current Version
                                        </Typography>
                                        <Chip label="v1.0.0" size="small" color="success" variant="outlined" />
                                    </Box>
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default About;
