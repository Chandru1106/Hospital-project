import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        primary: {
            main: '#10b981', // Emerald 500 - Vibrant Teal
            light: '#34d399',
            dark: '#059669',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#6366f1', // Indigo 500
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#ffffff',
        },
        background: {
            default: mode === 'dark' ? '#0f172a' : '#f8fafc', // Slate 900 / Slate 50
            paper: mode === 'dark' ? '#1e293b' : '#ffffff',   // Slate 800 / White
        },
        text: {
            primary: mode === 'dark' ? '#f1f5f9' : '#1e293b', // Slate 100 / Slate 800
            secondary: mode === 'dark' ? '#94a3b8' : '#64748b', // Slate 400 / Slate 500
        },
        success: {
            main: '#10b981',
        },
        error: {
            main: '#ef4444',
        },
        warning: {
            main: '#f59e0b',
        },
        info: {
            main: '#3b82f6',
        },
        divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700, letterSpacing: '-0.02em' },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: '0.95rem',
                    boxShadow: 'none',
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transform: 'translateY(-1px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: mode === 'dark'
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
                elevation24: {
                    boxShadow: mode === 'dark'
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                        : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: mode === 'dark'
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                    },
                },
            },
        },
    },
});

export const getTheme = (mode) => createTheme(getDesignTokens(mode));
