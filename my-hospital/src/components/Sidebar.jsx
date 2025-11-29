import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, Avatar, Divider } from '@mui/material';
import { Dashboard, History, BarChart, Settings, Person, Help, ExitToApp, LocalHospital, Info } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = user?.role === 'admin'
        ? [
            { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
            { text: 'User Management', icon: <Person />, path: '/user-management' },
            { text: 'Settings', icon: <Settings />, path: '/settings' },
            { text: 'My Profile', icon: <Person />, path: '/profile' },
        ]
        : [
            { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
            { text: 'My History', icon: <History />, path: '/history' },
            { text: 'My Profile', icon: <Person />, path: '/profile' },
            { text: 'Settings', icon: <Settings />, path: '/settings' },
            { text: 'Support', icon: <Help />, path: '/support' },
            { text: 'About', icon: <Info />, path: '/about' },
        ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 200,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 200,
                    boxSizing: 'border-box',
                    bgcolor: '#FAFAFA',
                    borderRight: '1px solid #E0E0E0',
                    boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
                },
            }}
        >
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4DD4AC 0%, #5BC5C5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px',
                    boxShadow: '0 4px 15px rgba(77, 212, 172, 0.3)'
                }}>
                    <LocalHospital sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C3E50' }}>
                    Health<span style={{ color: '#4DD4AC' }}>+</span>
                </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <List sx={{ px: 2 }}>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                            borderRadius: 2,
                            mb: 1,
                            bgcolor: location.pathname === item.path ? 'rgba(77, 212, 172, 0.1)' : 'transparent',
                            borderLeft: location.pathname === item.path ? '3px solid #4DD4AC' : '3px solid transparent',
                            '&:hover': {
                                bgcolor: 'rgba(77, 212, 172, 0.05)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{
                            color: location.pathname === item.path ? '#4DD4AC' : '#7F8C8D',
                            minWidth: 40
                        }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                                fontSize: '0.9rem',
                                fontWeight: location.pathname === item.path ? 600 : 400,
                                color: location.pathname === item.path ? '#2C3E50' : '#7F8C8D'
                            }}
                        />
                    </ListItem>
                ))}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Divider sx={{ my: 2 }} />

            <List sx={{ px: 2, pb: 2 }}>
                <ListItem
                    button
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 2,
                        '&:hover': {
                            bgcolor: 'rgba(255, 107, 107, 0.05)',
                        },
                    }}
                >
                    <ListItemIcon sx={{ color: '#FF6B6B', minWidth: 40 }}>
                        <ExitToApp />
                    </ListItemIcon>
                    <ListItemText
                        primary="Exit"
                        primaryTypographyProps={{
                            fontSize: '0.9rem',
                            color: '#FF6B6B'
                        }}
                    />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
