import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Card, CardContent, Typography, Avatar, IconButton, TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Menu, Divider, Badge, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Search, Notifications, Add, NavigateBefore, NavigateNext, Person, Logout, Settings } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [healthStats, setHealthStats] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [openModal, setOpenModal] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        date: '',
        time: '',
        type: 'new',
        notes: ''
    });

    // Header State
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [profileAnchor, setProfileAnchor] = useState(null);

    // Filtered Appointments
    const filteredAppointments = Array.isArray(appointments) ? appointments.filter(apt => {
        if (!apt) return false;
        const query = searchQuery.toLowerCase();
        const notesMatch = (apt.notes && typeof apt.notes === 'string') ? apt.notes.toLowerCase().includes(query) : false;
        const typeMatch = (apt.type && typeof apt.type === 'string') ? apt.type.toLowerCase().includes(query) : false;
        return notesMatch || typeMatch;
    }) : [];

    // Helpers for safe date formatting
    const getSafeDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date() : date;
    };

    const formatDay = (dateString) => {
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? '--' : date.getDate();
        } catch (e) { return '--'; }
    };

    const formatMonth = (dateString) => {
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', { month: 'short' });
        } catch (e) { return ''; }
    };

    // Handlers
    const handleNotificationClick = (event) => setNotificationAnchor(event.currentTarget);
    const handleNotificationClose = () => setNotificationAnchor(null);

    const handleProfileClick = (event) => setProfileAnchor(event.currentTarget);
    const handleProfileClose = () => setProfileAnchor(null);

    const handleLogout = () => {
        handleProfileClose();
        logout();
        navigate('/login');
    };

    const handleProfileNavigation = () => {
        handleProfileClose();
        navigate('/my-profile');
    };

    // Calendar helper functions
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 };
    };

    const getMonthName = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const hasAppointment = (day) => {
        return appointments.some(apt => {
            const aptDate = getSafeDate(apt.date);
            return aptDate.getDate() === day &&
                aptDate.getMonth() === currentDate.getMonth() &&
                aptDate.getFullYear() === currentDate.getFullYear();
        });
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const handleCreateAppointment = async () => {
        try {
            if (!profileData?.patient_id) {
                alert('Please complete your profile first');
                return;
            }

            await api.post('/appointments', {
                ...newAppointment,
                patient_id: profileData.patient_id
            });
            setOpenModal(false);
            fetchDashboardData();
            setNewAppointment({ date: '', time: '', type: 'new', notes: '' });
        } catch (error) {
            console.error('Failed to create appointment:', error);
            const errorMessage = error.response?.data?.error || 'Failed to create appointment';
            alert(errorMessage);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        // Refresh data when page becomes visible
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchDashboardData();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Refresh data every 30 seconds
        const interval = setInterval(() => {
            fetchDashboardData();
        }, 30000);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(interval);
        };
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch appointments
            const appointmentsRes = await api.get('/appointments');
            console.log('Appointments fetched:', appointmentsRes.data);
            if (Array.isArray(appointmentsRes.data)) {
                setAppointments(appointmentsRes.data);
            } else {
                console.error('Appointments data is not an array:', appointmentsRes.data);
                setAppointments([]);
            }

            // Fetch health statistics
            try {
                const statsRes = await api.get('/health/statistics');
                setHealthStats(statsRes.data);
            } catch (error) {
                console.log('No health stats available');
            }

            // Fetch admin specific data
            if (user?.role === 'admin') {
                try {
                    const patientsRes = await api.get('/patients');
                    setHealthStats(prev => ({ ...prev, totalPatients: patientsRes.data.length }));
                } catch (error) {
                    console.error('Error fetching patients count:', error);
                }
            }

            // Fetch profile data (only for regular users)
            if (user?.role !== 'admin') {
                try {
                    const profileRes = await api.get('/patients/my-profile');
                    console.log('Profile data fetched:', profileRes.data);
                    console.log('Current BPM from profile:', profileRes.data.current_bpm);
                    setProfileData(profileRes.data);
                } catch (error) {
                    console.log('No profile data available:', error);
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const bloodPressureData = healthStats?.bloodPressure?.history || [60, 75, 65, 85, 70];
    const activityData = healthStats?.heartRate?.history || [40, 55, 75, 88, 65, 50, 45];

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            p: { xs: 2, md: 4 }
        }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E293B', fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                        Health <span style={{ color: '#10B981' }}>+</span>
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            placeholder="Search appointments..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: '#94A3B8', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: 3,
                                    backgroundColor: 'background.paper',
                                    '& fieldset': { border: 'none' },
                                    fontSize: '0.9rem',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                                }
                            }}
                            sx={{ width: { xs: 150, md: 280 } }}
                        />

                        {/* Notifications */}
                        <IconButton
                            onClick={handleNotificationClick}
                            sx={{
                                position: 'relative',
                                bgcolor: 'background.paper',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                '&:hover': { bgcolor: 'action.hover', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }
                            }}
                        >
                            <Badge color="error" variant="dot">
                                <Notifications sx={{ fontSize: 22, color: '#64748B' }} />
                            </Badge>
                        </IconButton>
                        <Menu
                            anchorEl={notificationAnchor}
                            open={Boolean(notificationAnchor)}
                            onClose={handleNotificationClose}
                            PaperProps={{
                                sx: { width: 320, maxHeight: 400, mt: 1.5, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <Box sx={{ p: 2, borderBottom: '1px solid #F1F5F9' }}>
                                <Typography variant="subtitle2" fontWeight={700}>Notifications</Typography>
                            </Box>
                            <List sx={{ p: 0 }}>
                                <ListItem button onClick={handleNotificationClose}>
                                    <ListItemText
                                        primary="Upcoming Appointment"
                                        secondary="Dr. Smith - Tomorrow at 10:00 AM"
                                        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
                                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                    />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem button onClick={handleNotificationClose}>
                                    <ListItemText
                                        primary="Test Results Available"
                                        secondary="Blood work results are ready"
                                        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
                                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                    />
                                </ListItem>
                            </List>
                        </Menu>

                        {/* Add Button */}
                        <IconButton
                            onClick={() => setOpenModal(true)}
                            sx={{
                                bgcolor: 'background.paper',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                '&:hover': { bgcolor: 'action.hover', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }
                            }}
                        >
                            <Add sx={{ fontSize: 22, color: '#64748B' }} />
                        </IconButton>

                        {/* Profile */}
                        <Box
                            onClick={handleProfileClick}
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                gap: 1.5,
                                cursor: 'pointer',
                                bgcolor: 'background.paper',
                                px: 2.5,
                                py: 1.2,
                                borderRadius: 3,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }
                            }}
                        >
                            <Avatar sx={{ width: 40, height: 40, bgcolor: '#10B981', fontWeight: 600 }}>
                                {user?.username?.charAt(0).toUpperCase() || 'Z'}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B' }}>
                                {user?.username || 'User'}
                            </Typography>
                        </Box>
                        <Menu
                            anchorEl={profileAnchor}
                            open={Boolean(profileAnchor)}
                            onClose={handleProfileClose}
                            PaperProps={{
                                sx: { width: 200, mt: 1.5, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Typography variant="subtitle2" fontWeight={700}>{user?.username}</Typography>
                                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                            </Box>
                            <Divider />
                            <MenuItem onClick={handleProfileNavigation} sx={{ py: 1.5 }}>
                                <Person sx={{ mr: 2, fontSize: 20, color: '#64748B' }} />
                                <Typography variant="body2" fontWeight={500}>My Profile</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleProfileClose} sx={{ py: 1.5 }}>
                                <Settings sx={{ mr: 2, fontSize: 20, color: '#64748B' }} />
                                <Typography variant="body2" fontWeight={500}>Settings</Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#EF4444' }}>
                                <Logout sx={{ mr: 2, fontSize: 20 }} />
                                <Typography variant="body2" fontWeight={600}>Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>

                {/* Quick Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Total Appointments */}
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card sx={{
                                borderRadius: 5,
                                boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
                                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                color: 'white',
                                height: '100%',
                                minHeight: '150px',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 20px 60px rgba(59, 130, 246, 0.4)'
                                }
                            }}>
                                <CardContent sx={{ p: 3.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', position: 'relative', zIndex: 1 }}>
                                    <Typography variant="body2" sx={{ opacity: 0.95, mb: 1, fontWeight: 600, letterSpacing: '0.5px' }}>
                                        Total Appointments
                                    </Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '3rem' }}>
                                        {filteredAppointments.length}
                                    </Typography>
                                </CardContent>
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -30,
                                    right: -30,
                                    width: 120,
                                    height: 120,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.1)',
                                    zIndex: 0
                                }} />
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Admin Specific Stats */}
                    {user?.role === 'admin' && (
                        <>
                            {/* Total Patients */}
                            <Grid item xs={12} sm={6} md={3}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <Card sx={{
                                        borderRadius: 4,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                                        color: 'white'
                                    }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                                Total Patients
                                            </Typography>
                                            <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                                {healthStats?.totalPatients || '--'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>

                            {/* Today's Appointments */}
                            <Grid item xs={12} sm={6} md={3}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    <Card sx={{
                                        borderRadius: 4,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                        color: 'white'
                                    }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                                Today's Appointments
                                            </Typography>
                                            <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                                {appointments.filter(apt => {
                                                    const aptDate = new Date(apt.date);
                                                    const today = new Date();
                                                    return aptDate.getDate() === today.getDate() &&
                                                        aptDate.getMonth() === today.getMonth() &&
                                                        aptDate.getFullYear() === today.getFullYear();
                                                }).length}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        </>
                    )}

                    {user?.role !== 'admin' && (
                        <>
                            {/* Current BPM */}
                            <Grid item xs={12} sm={6} md={3}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <Card sx={{
                                        borderRadius: 5,
                                        boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3)',
                                        background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                        color: 'white',
                                        height: '100%',
                                        minHeight: '150px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 60px rgba(239, 68, 68, 0.4)'
                                        }
                                    }}>
                                        <CardContent sx={{ p: 3.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', position: 'relative', zIndex: 1 }}>
                                            <Typography variant="body2" sx={{ opacity: 0.95, mb: 1, fontWeight: 600, letterSpacing: '0.5px' }}>
                                                Current BPM
                                            </Typography>
                                            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '3rem' }}>
                                                {profileData?.current_bpm || '--'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>

                            {/* Profile Completion */}
                            <Grid item xs={12} sm={6} md={3}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                    <Card sx={{
                                        borderRadius: 5,
                                        boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)',
                                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                        color: 'white',
                                        height: '100%',
                                        minHeight: '150px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 60px rgba(245, 158, 11, 0.4)'
                                        }
                                    }}>
                                        <CardContent sx={{ p: 3.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', position: 'relative', zIndex: 1 }}>
                                            <Box>
                                                <Typography variant="body2" sx={{ opacity: 0.95, mb: 1, fontWeight: 600, letterSpacing: '0.5px' }}>
                                                    Profile Status
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                                    <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '3rem' }}>
                                                        {profileData ? '✓' : '!'}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 600 }}>
                                                        {profileData ? 'Complete' : 'Incomplete'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: -30,
                                            right: -30,
                                            width: 120,
                                            height: 120,
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.1)',
                                            zIndex: 0
                                        }} />
                                    </Card>
                                </motion.div>
                            </Grid>
                        </>
                    )}
                </Grid>

                <Grid container spacing={3}>
                    {/* Left Column - Calendar */}
                    <Grid item xs={12} md={6} lg={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card sx={{
                                borderRadius: 4,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                background: 'background.paper',
                                height: '100%'
                            }}>
                                <CardContent sx={{ p: 3.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#1E293B' }}>
                                            Calendar
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#64748B' }}>
                                                {getMonthName(currentDate)}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => navigateMonth(-1)}
                                                sx={{ bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}
                                            >
                                                <NavigateBefore fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => navigateMonth(1)}
                                                sx={{ bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}
                                            >
                                                <NavigateNext fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    {/* Calendar Grid - Day Headers */}
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 2 }}>
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                            <Typography key={day} variant="caption" sx={{
                                                fontWeight: 600,
                                                color: '#94A3B8',
                                                textAlign: 'center',
                                                fontSize: '0.7rem',
                                                textTransform: 'uppercase'
                                            }}>
                                                {day}
                                            </Typography>
                                        ))}
                                    </Box>

                                    {/* Calendar Grid - Days */}
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 3 }}>
                                        {(() => {
                                            const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
                                            const days = [];

                                            // Empty cells before first day
                                            for (let i = 0; i < startingDayOfWeek; i++) {
                                                days.push(<Box key={`empty-${i}`} />);
                                            }

                                            // Actual days
                                            for (let day = 1; day <= daysInMonth; day++) {
                                                const today = isToday(day);
                                                const hasApt = hasAppointment(day);

                                                // Create date object for this day
                                                const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                                const dateStr = dateObj.toISOString().split('T')[0];
                                                const isSelected = selectedDate === dateStr;

                                                days.push(
                                                    <Box key={day}
                                                        onClick={() => setSelectedDate(dateStr)}
                                                        sx={{
                                                            textAlign: 'center',
                                                            py: 1,
                                                            borderRadius: 2,
                                                            bgcolor: isSelected ? '#10B981' : (today ? '#E2E8F0' : 'transparent'),
                                                            color: isSelected ? 'white' : (today ? '#1E293B' : '#334155'),
                                                            fontWeight: (today || isSelected) ? 700 : 500,
                                                            fontSize: '0.9rem',
                                                            cursor: 'pointer',
                                                            position: 'relative',
                                                            transition: 'all 0.2s',
                                                            border: today && !isSelected ? '1px solid #10B981' : 'none',
                                                            '&:hover': {
                                                                bgcolor: isSelected ? '#059669' : '#F1F5F9',
                                                                transform: 'scale(1.05)'
                                                            }
                                                        }}>
                                                        {day}
                                                        {hasApt && (
                                                            <Box sx={{
                                                                position: 'absolute',
                                                                bottom: 4,
                                                                left: '50%',
                                                                transform: 'translateX(-50%)',
                                                                width: 4,
                                                                height: 4,
                                                                borderRadius: '50%',
                                                                bgcolor: isSelected ? 'white' : '#F97316'
                                                            }} />
                                                        )}
                                                    </Box>
                                                );
                                            }
                                            return days;
                                        })()}
                                    </Box>

                                    {/* Selected Date Appointments */}
                                    <Box sx={{ minHeight: 100 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1.5 }}>
                                            Appointments for {new Date(selectedDate).toLocaleDateString()}
                                        </Typography>

                                        {appointments.filter(apt => apt.date === selectedDate).length > 0 ? (
                                            appointments.filter(apt => apt.date === selectedDate).map((apt, index) => (
                                                <Box key={index} sx={{
                                                    p: 2,
                                                    borderRadius: 3,
                                                    bgcolor: '#FFF7ED',
                                                    border: '1px solid #FFEDD5',
                                                    mb: 1
                                                }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E293B', mb: 0.5 }}>
                                                        {apt.type === 'new' ? 'New Consultation' : 'Review'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                                                        {apt.time} • {apt.notes || 'No notes'}
                                                    </Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="caption" sx={{ color: '#94A3B8', fontStyle: 'italic' }}>
                                                No appointments scheduled
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Add Appointment Button */}
                                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<Add />}
                                            onClick={() => {
                                                setNewAppointment(prev => ({ ...prev, date: selectedDate }));
                                                setOpenModal(true);
                                            }}
                                            sx={{
                                                bgcolor: '#10B981',
                                                '&:hover': { bgcolor: '#059669' },
                                                borderRadius: 3,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                px: 3
                                            }}
                                        >
                                            Add Appointment
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Middle Column - Appointments List */}
                    <Grid item xs={12} md={6} lg={4}>
                        <Card
                            elevation={4}
                            sx={{
                                borderRadius: 4,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                overflow: 'hidden',
                                height: '100%',
                                background: 'background.paper'
                            }}
                        >
                            <Box
                                sx={{
                                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                    p: 3,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    color: 'white'
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {user?.role === 'admin' ? 'All Appointments' : 'My Appointments'}
                                </Typography>
                                {user?.role !== 'admin' && (
                                    <IconButton
                                        size="small"
                                        sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                                        onClick={() => setOpenModal(true)}
                                    >
                                        <Add />
                                    </IconButton>
                                )}
                            </Box>
                            <CardContent sx={{ p: 0, maxHeight: 600, overflow: 'auto' }}>
                                {filteredAppointments.length > 0 ? (
                                    <List sx={{ p: 0 }}>
                                        {filteredAppointments.map((apt, index) => (
                                            <React.Fragment key={apt.appointment_id || index}>
                                                <ListItem
                                                    alignItems="flex-start"
                                                    sx={{
                                                        p: 3,
                                                        transition: 'all 0.2s',
                                                        '&:hover': { bgcolor: '#F8FAFC' }
                                                    }}
                                                >
                                                    <Box sx={{
                                                        mr: 3,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        minWidth: 60
                                                    }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#10B981', lineHeight: 1 }}>
                                                            {formatDay(apt.date)}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                                                            {formatMonth(apt.date)}
                                                        </Typography>
                                                    </Box>
                                                    <ListItemText
                                                        primary={
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1E293B' }}>
                                                                    {apt.type === 'checkup' ? 'General Checkup' :
                                                                        apt.type === 'consultation' ? 'Doctor Consultation' :
                                                                            apt.type === 'followup' ? 'Follow-up Visit' : 'New Appointment'}
                                                                </Typography>
                                                                <Chip
                                                                    label={apt.time}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: '#F1F5F9',
                                                                        color: '#475569',
                                                                        fontWeight: 600,
                                                                        borderRadius: 2
                                                                    }}
                                                                />
                                                            </Box>
                                                        }
                                                        secondary={
                                                            <Box>
                                                                {user?.role === 'admin' && apt.Patient && (
                                                                    <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500, mb: 0.5 }}>
                                                                        Patient: {apt.Patient.name}
                                                                    </Typography>
                                                                )}
                                                                <Typography variant="body2" sx={{ color: '#64748B' }}>
                                                                    {apt.notes || 'No additional notes'}
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                </ListItem>
                                                {index < filteredAppointments.length - 1 && <Divider component="li" />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                ) : (
                                    <Box sx={{ p: 6, textAlign: 'center' }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No appointments found matching your criteria
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Column - Heart Rate */}
                    {user?.role !== 'admin' && (
                        <Grid item xs={12} md={12} lg={4}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            >
                                <Card sx={{
                                    borderRadius: 5,
                                    boxShadow: '0 15px 50px rgba(16, 185, 129, 0.35)',
                                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                    color: 'white',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    height: { lg: '100%' },
                                    minHeight: 450,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: '0 20px 60px rgba(16, 185, 129, 0.45)'
                                    }
                                }}>
                                    <CardContent sx={{ p: 4, position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.5px' }}>
                                                Heart Rate
                                            </Typography>
                                            <Box sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem',
                                                animation: 'heartbeat 1.5s ease-in-out infinite',
                                                '@keyframes heartbeat': {
                                                    '0%, 100%': { transform: 'scale(1)' },
                                                    '10%, 30%': { transform: 'scale(1.1)' },
                                                    '20%': { transform: 'scale(1)' }
                                                }
                                            }}>
                                                ❤️
                                            </Box>
                                        </Box>

                                        {/* Enhanced ECG-style heartbeat visualization */}
                                        <Box sx={{ height: 140, position: 'relative', mb: 'auto', mt: 2 }}>
                                            <svg width="100%" height="140" viewBox="0 0 400 140" preserveAspectRatio="none" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
                                                <defs>
                                                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.6)' }} />
                                                        <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,1)' }} />
                                                        <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.6)' }} />
                                                    </linearGradient>
                                                    <filter id="glow">
                                                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                                        <feMerge>
                                                            <feMergeNode in="coloredBlur" />
                                                            <feMergeNode in="SourceGraphic" />
                                                        </feMerge>
                                                    </filter>
                                                </defs>
                                                <polyline
                                                    points="0,70 50,70 60,20 70,120 80,70 130,70 140,20 150,120 160,70 210,70 220,20 230,120 240,70 290,70 300,20 310,120 320,70 370,70 380,20 390,120 400,70"
                                                    fill="none"
                                                    stroke="url(#lineGradient)"
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    opacity="0.95"
                                                    filter="url(#glow)"
                                                >
                                                    <animate
                                                        attributeName="stroke-dasharray"
                                                        from="0,1000"
                                                        to="1000,0"
                                                        dur="2s"
                                                        repeatCount="indefinite"
                                                    />
                                                </polyline>
                                            </svg>
                                        </Box>

                                        {/* BPM Display */}
                                        <Box sx={{ mt: 'auto' }}>
                                            <Typography variant="h1" sx={{ fontWeight: 900, fontSize: '5.5rem', lineHeight: 1, mb: 1, textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                                                {profileData?.current_bpm || '--'}
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 700, opacity: 0.95, fontSize: '1.25rem', letterSpacing: '1px' }}>
                                                BPM
                                            </Typography>
                                            {profileData?.current_bpm && (
                                                <Typography variant="caption" sx={{ opacity: 0.85, mt: 1, display: 'block', fontWeight: 500 }}>
                                                    {profileData.current_bpm < 60 ? '⚠️ Below Normal' :
                                                        profileData.current_bpm > 100 ? '⚠️ Above Normal' :
                                                            '✓ Normal Range'}
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>

                                    {/* Decorative circles */}
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: -60,
                                        right: -60,
                                        width: 220,
                                        height: 220,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.08)',
                                        zIndex: 0
                                    }} />
                                    <Box sx={{
                                        position: 'absolute',
                                        top: -30,
                                        right: -30,
                                        width: 150,
                                        height: 150,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.06)',
                                        zIndex: 0
                                    }} />
                                </Card>
                            </motion.div>
                        </Grid>
                    )}
                </Grid>

                {/* Add Appointment Modal */}
                <Dialog
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    PaperProps={{
                        sx: { borderRadius: 3, maxWidth: 400, width: '100%' }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>New Appointment</DialogTitle>
                    <DialogContent>
                        <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={newAppointment.date}
                                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                            />
                            <TextField
                                label="Time"
                                type="time"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={newAppointment.time}
                                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                            />
                            <TextField
                                select
                                label="Type"
                                fullWidth
                                value={newAppointment.type}
                                onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                            >
                                <MenuItem value="new">New Consultation</MenuItem>
                                <MenuItem value="review">Review</MenuItem>
                            </TextField>
                            <TextField
                                label="Notes"
                                multiline
                                rows={3}
                                fullWidth
                                value={newAppointment.notes}
                                onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button onClick={() => setOpenModal(false)} sx={{ color: '#64748B' }}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleCreateAppointment}
                            sx={{
                                bgcolor: '#10B981',
                                '&:hover': { bgcolor: '#059669' },
                                borderRadius: 2,
                                px: 3
                            }}
                        >
                            Schedule
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default Dashboard;
