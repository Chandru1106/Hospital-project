import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, InputAdornment, IconButton, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon, AdminPanelSettings } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import hospitalBg from '../assets/hospital_bg.png';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(formData.email, formData.password);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex' }}>
            {/* Left Side - Image */}
            {!isMobile && (
                <Box
                    sx={{
                        flex: 1,
                        background: `url(${hospitalBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to right, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.8))',
                        }
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 80,
                            left: 60,
                            zIndex: 2,
                            color: 'white',
                            maxWidth: '600px'
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.02em' }}>
                                Advanced Care,<br />Simplified.
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 400, opacity: 0.9 }}>
                                Experience the future of hospital management with our state-of-the-art platform.
                            </Typography>
                        </motion.div>
                    </Box>
                </Box>
            )}

            {/* Right Side - Form */}
            <Box
                sx={{
                    flex: isMobile ? 1 : '0 0 500px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: 4,
                    background: theme.palette.background.default,
                    position: 'relative'
                }}
            >
                <Tooltip title={isAdminLogin ? "Switch to Patient Login" : "Admin Login"}>
                    <IconButton
                        onClick={() => setIsAdminLogin(!isAdminLogin)}
                        sx={{
                            position: 'absolute',
                            top: 24,
                            right: 24,
                            background: isAdminLogin
                                ? `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`
                                : theme.palette.action.hover,
                            color: isAdminLogin ? 'white' : theme.palette.text.secondary,
                            '&:hover': {
                                background: isAdminLogin
                                    ? `linear-gradient(135deg, ${theme.palette.secondary.dark}, ${theme.palette.primary.dark})`
                                    : theme.palette.action.selected,
                            },
                        }}
                    >
                        <AdminPanelSettings />
                    </IconButton>
                </Tooltip>

                <Container maxWidth="xs">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
                                {isAdminLogin ? 'Admin Portal' : 'Welcome Back'}
                            </Typography>
                            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                                {isAdminLogin
                                    ? 'Please enter your administrator credentials.'
                                    : 'Sign in to access your patient dashboard.'}
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email or Username"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                sx={{ mb: 3 }}
                                variant="outlined"
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                sx={{ mb: 4 }}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={<LoginIcon />}
                                sx={{
                                    py: 1.8,
                                    fontSize: '1rem',
                                    background: isAdminLogin
                                        ? `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`
                                        : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                }}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            {!isAdminLogin && (
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    Don't have an account?{' '}
                                    <Link to="/signup" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 600 }}>
                                        Create Account
                                    </Link>
                                </Typography>
                            )}
                        </Box>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
};

export default Login;
