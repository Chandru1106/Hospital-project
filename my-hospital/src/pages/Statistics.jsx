import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { TrendingUp, TrendingDown, Remove, Favorite, MonitorHeart, LocalHospital } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../services/api';

const Statistics = () => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const statsRes = await api.get('/health/statistics');
            setStatistics(statsRes.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTrendIcon = (trend) => {
        if (trend === 'increasing') return <TrendingUp sx={{ color: '#EF4444' }} />;
        if (trend === 'decreasing') return <TrendingDown sx={{ color: '#10B981' }} />;
        return <Remove sx={{ color: '#94A3B8' }} />;
    };

    const getTrendColor = (trend) => {
        if (trend === 'increasing') return '#FEE2E2';
        if (trend === 'decreasing') return '#D1FAE5';
        return '#F1F5F9';
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
                        Health Statistics
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748B' }}>
                        View your health trends and analytics
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {statistics && statistics.hasData ? (
                        <>
                            {/* Heart Rate Stats */}
                            {statistics.heartRate && statistics.heartRate.trend !== 'none' && (
                                <Grid item xs={12} md={6} lg={4}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Card sx={{
                                            borderRadius: 4,
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                            background: 'white'
                                        }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Box sx={{
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        bgcolor: '#FEE2E2',
                                                        mr: 2
                                                    }}>
                                                        <Favorite sx={{ color: '#EF4444', fontSize: 28 }} />
                                                    </Box>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                                                            Heart Rate
                                                        </Typography>
                                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                                            {statistics.heartRate.average} bpm
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: getTrendColor(statistics.heartRate.trend)
                                                }}>
                                                    {getTrendIcon(statistics.heartRate.trend)}
                                                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 600, color: '#1E293B' }}>
                                                        {Math.abs(statistics.heartRate.change)}% vs last week
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            )}

                            {/* Blood Pressure Stats */}
                            {statistics.bloodPressure && statistics.bloodPressure.trend !== 'none' && (
                                <Grid item xs={12} md={6} lg={4}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 }}
                                    >
                                        <Card sx={{
                                            borderRadius: 4,
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                            background: 'white'
                                        }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Box sx={{
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        bgcolor: '#DBEAFE',
                                                        mr: 2
                                                    }}>
                                                        <MonitorHeart sx={{ color: '#3B82F6', fontSize: 28 }} />
                                                    </Box>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                                                            Blood Pressure
                                                        </Typography>
                                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                                            {statistics.bloodPressure.systolic}/{statistics.bloodPressure.diastolic}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: getTrendColor(statistics.bloodPressure.trend)
                                                }}>
                                                    {getTrendIcon(statistics.bloodPressure.trend)}
                                                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 600, color: '#1E293B' }}>
                                                        {Math.abs(statistics.bloodPressure.change)}% vs last week
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            )}
                        </>
                    ) : (
                        <Grid item xs={12}>
                            <Card sx={{
                                borderRadius: 4,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                background: 'white'
                            }}>
                                <CardContent sx={{ p: 8, textAlign: 'center' }}>
                                    <LocalHospital sx={{ fontSize: 100, color: '#E5E7EB', mb: 3 }} />
                                    <Typography variant="h4" sx={{ color: '#6B7280', fontWeight: 700, mb: 2 }}>
                                        No Statistics Available
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#9CA3AF', mb: 1 }}>
                                        Start tracking your health by adding BPM readings in your profile
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                                        Go to Profile → Medical History → Add your current BPM
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default Statistics;
