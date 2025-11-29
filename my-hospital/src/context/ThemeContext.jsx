import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode || 'light';
    });

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: '#10B981', // Emerald 500
                        light: '#34D399',
                        dark: '#059669',
                    },
                    secondary: {
                        main: '#3B82F6', // Blue 500
                    },
                    background: {
                        default: mode === 'light' ? '#F0F9FF' : '#0F172A', // Slate 900 for dark
                        paper: mode === 'light' ? '#FFFFFF' : '#1E293B',   // Slate 800 for dark
                    },
                    text: {
                        primary: mode === 'light' ? '#1E293B' : '#F8FAFC',
                        secondary: mode === 'light' ? '#64748B' : '#94A3B8',
                    },
                },
                typography: {
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    h1: { fontWeight: 800 },
                    h2: { fontWeight: 700 },
                    h3: { fontWeight: 700 },
                    h4: { fontWeight: 700 },
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
                                borderRadius: 8,
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                },
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: 16,
                                backgroundImage: 'none', // Remove default gradient in dark mode
                            },
                        },
                    },
                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 12,
                                },
                            },
                        },
                    },
                },
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={{ mode, toggleColorMode }}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};
