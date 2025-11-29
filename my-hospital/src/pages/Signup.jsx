import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, InputAdornment, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import hospitalBg from '../assets/hospital_bg.png';

const Signup = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        const result = await register(formData.username, formData.email, formData.password);
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
                                Join Our<br />Network.
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 400, opacity: 0.9 }}>
                                Create an account to manage your health journey with ease and precision.
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
                <Container maxWidth="xs">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
                                Create Account
                            </Typography>
                            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                                Enter your details to get started.
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
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2 }}
                                variant="outlined"
                            />
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2 }}
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
                                sx={{ mb: 2 }}
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
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                sx={{ mb: 4 }}
                                variant="outlined"
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={<PersonAdd />}
                                sx={{
                                    py: 1.8,
                                    fontSize: '1rem',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                }}
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </Button>
                        </form>

                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 600 }}>
                                    Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
};

export default Signup;
