import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from './pages/Dashboard';
import { BrowserRouter } from 'react-router-dom';

// Mock useAuth
const mockUseAuth = vi.fn();
vi.mock('./context/AuthContext', async () => {
    const actual = await vi.importActual('./context/AuthContext');
    return {
        ...actual,
        useAuth: () => mockUseAuth(),
    };
});

// Mock api
vi.mock('./services/api', () => ({
    default: {
        get: vi.fn((url) => {
            if (url === '/health/statistics') {
                return Promise.resolve({ data: { heart_rate: 75, blood_pressure: '120/80' } });
            }
            if (url === '/appointments') {
                return Promise.resolve({ data: [] });
            }
            if (url === '/patients/my-profile') {
                return Promise.resolve({ data: { name: 'Test User', age: 30 } });
            }
            if (url === '/patients') {
                return Promise.resolve({ data: [] });
            }
            return Promise.resolve({ data: {} });
        }),
    },
}));

describe('Dashboard Component', () => {
    it('renders dashboard for patient', async () => {
        mockUseAuth.mockReturnValue({
            user: { username: 'patient', role: 'patient' },
            loading: false,
        });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/My Appointments/i)).toBeInTheDocument();
    });

    it('renders dashboard for admin', async () => {
        mockUseAuth.mockReturnValue({
            user: { username: 'admin', role: 'admin' },
            loading: false,
        });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/All Appointments/i)).toBeInTheDocument();
    });
});
