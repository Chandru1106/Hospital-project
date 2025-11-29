import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock useAuth
const mockLogin = vi.fn();
vi.mock('./context/AuthContext', async () => {
    const actual = await vi.importActual('./context/AuthContext');
    return {
        ...actual,
        useAuth: () => ({
            login: mockLogin,
            loading: false,
        }),
    };
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Login Component', () => {
    it('renders login form', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        expect(screen.getByLabelText(/Email or Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('handles login submission', async () => {
        mockLogin.mockResolvedValue({ success: true });
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('testuser', 'password');
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('displays error on failed login', async () => {
        mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: 'wrong' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrong' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
        });
    });
});
