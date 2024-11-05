import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import SecureRoute from '../components/SecureRoute/SecureRoute';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import UserDashboard from '../pages/Dashboard/Dashboard';

jest.mock('../services/authService');

describe('Role-Based Access Control Tests', () => {
  const renderWithAuth = (component, user = null) => {
    return render(
      <BrowserRouter>
        <AuthProvider initialUser={user}>
          {component}
        </AuthProvider>
      </BrowserRouter>
    );
  };

  describe('SecureRoute Component', () => {
    test('redirects to login when not authenticated', async () => {
      renderWithAuth(
        <SecureRoute>
          <div>Protected Content</div>
        </SecureRoute>
      );

      await waitFor(() => {
        expect(window.location.pathname).toBe('/login');
      });
    });

    test('allows access when authenticated', async () => {
      const user = { id: 1, role: 'user' };
      renderWithAuth(
        <SecureRoute>
          <div>Protected Content</div>
        </SecureRoute>,
        user
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    test('restricts admin routes for regular users', async () => {
      const user = { id: 1, role: 'user' };
      renderWithAuth(
        <SecureRoute requiredRole="admin">
          <AdminDashboard />
        </SecureRoute>,
        user
      );

      await waitFor(() => {
        expect(window.location.pathname).toBe('/unauthorized');
      });
    });

    test('allows admin access to admin routes', async () => {
      const admin = { id: 1, role: 'admin' };
      renderWithAuth(
        <SecureRoute requiredRole="admin">
          <AdminDashboard />
        </SecureRoute>,
        admin
      );

      expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
    });
  });

  describe('Dashboard Access', () => {
    test('user dashboard shows appropriate content', async () => {
      const user = { id: 1, role: 'user', name: 'Test User' };
      renderWithAuth(<UserDashboard />, user);

      expect(screen.getByText(/welcome, test user/i)).toBeInTheDocument();
      expect(screen.queryByText(/website statistics/i)).not.toBeInTheDocument();
    });

    test('admin dashboard shows all features', async () => {
      const admin = { id: 1, role: 'admin', name: 'Admin User' };
      renderWithAuth(<AdminDashboard />, admin);

      expect(screen.getByText(/website statistics/i)).toBeInTheDocument();
      expect(screen.getByText(/user management/i)).toBeInTheDocument();
      expect(screen.getByText(/content management/i)).toBeInTheDocument();
    });
  });
}); 