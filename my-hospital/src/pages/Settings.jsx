import React from 'react';
import { Box, Typography, Card, CardContent, Switch, FormControlLabel, Divider } from '@mui/material';
import { useThemeContext } from '../context/ThemeContext';
import { DarkMode, LightMode } from '@mui/icons-material';

const Settings = () => {
    const { mode, toggleColorMode } = useThemeContext();

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', bgcolor: 'background.default' }}>
            <Typography variant="h4" sx={{ mb: 4, color: 'text.primary' }}>
                Settings
            </Typography>

            <Card sx={{ maxWidth: 600, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
                        Appearance
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {mode === 'dark' ? (
                                <DarkMode sx={{ color: 'primary.main' }} />
                            ) : (
                                <LightMode sx={{ color: 'warning.main' }} />
                            )}
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    Dark Mode
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Adjust the appearance of the application
                                </Typography>
                            </Box>
                        </Box>
                        <Switch
                            checked={mode === 'dark'}
                            onChange={toggleColorMode}
                            color="primary"
                        />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
                        Notifications
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                Email Notifications
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Receive updates via email
                            </Typography>
                        </Box>
                        <Switch defaultChecked color="primary" />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Settings;
