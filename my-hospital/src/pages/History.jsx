import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { LocalHospital, Favorite, MonitorHeart } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../services/api';

const History = () => {
    const [healthRecords, setHealthRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHealthData();
    }, []);

    const fetchHealthData = async () => {
        try {
            const recordsRes = await api.get('/health/records');
            setHealthRecords(recordsRes.data);
        } catch (error) {
            console.error('Error fetching health data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            p: { xs: 2, md: 4 }
        }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E293B', mb: 1 }}>
                        Medical History
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748B' }}>
                        View your past health records and readings
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Health Records */}
                    <Grid item xs={12}>
                        <Card sx={{
                            borderRadius: 4,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                            background: 'white'
                        }}>
                            <Box sx={{
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                p: 3,
                                color: 'white',
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocalHospital sx={{ mr: 1.5, fontSize: 32 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                        Health Records
                                    </Typography>
                                </Box>
                            </Box>
                            <CardContent sx={{ p: 4 }}>
                                {healthRecords.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {healthRecords.map((record, index) => (
                                            <Grid item xs={12} key={index}>
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <Box sx={{
                                                        p: 3,
                                                        borderRadius: 3,
                                                        border: '2px solid #E5E7EB',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            borderColor: '#10B981',
                                                            transform: 'translateX(4px)',
                                                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                                                        }
                                                    }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                            <Box sx={{
                                                                p: 2,
                                                                borderRadius: 2,
                                                                bgcolor: record.type === 'heartRate' ? '#FEE2E2' : '#DBEAFE'
                                                            }}>
                                                                {record.type === 'heartRate' ? (
                                                                    <Favorite sx={{ color: '#EF4444', fontSize: 28 }} />
                                                                ) : (
                                                                    <MonitorHeart sx={{ color: '#3B82F6', fontSize: 28 }} />
                                                                )}
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 0.5 }}>
                                                                    {record.type === 'heartRate' ? `${record.value} bpm` : `${record.systolic}/${record.diastolic} mmHg`}
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ color: '#64748B' }}>
                                                                    {record.note || 'No notes'}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ textAlign: 'right' }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                                                                {formatDate(record.timestamp)}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                                                {formatTime(record.timestamp)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </motion.div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 8 }}>
                                        <LocalHospital sx={{ fontSize: 80, color: '#E5E7EB', mb: 2 }} />
                                        <Typography variant="h5" sx={{ color: '#6B7280', fontWeight: 700, mb: 1 }}>
                                            No Past History
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#9CA3AF', mb: 1 }}>
                                            Your health records will appear here once you start tracking
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                                            Add BPM readings in your Profile → Medical History
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default History;
