import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
    it('renders login page by default', () => {
        // We need to mock the providers or wrap App in them if App doesn't include them
        // But App includes providers, so we can just render it.
        // However, App uses Router, so we should be careful.
        // Let's just try rendering it.
        render(<App />);
        // Expect to see "Patient Portal" or "Sign In"
        expect(screen.getByText(/Patient Portal/i)).toBeInTheDocument();
    });
});
