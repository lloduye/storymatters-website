import apiService from '../services/apiService';
import SessionService from '../services/sessionService';

describe('API Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    test('login sets session data', async () => {
      const mockResponse = {
        token: 'test-token',
        user: { id: 1, name: 'Test User' }
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        })
      );

      await apiService.login({ email: 'test@example.com', password: 'password' });

      expect(SessionService.getToken()).toBe('test-token');
      expect(SessionService.getCurrentUser()).toEqual(mockResponse.user);
    });

    test('logout clears session data', async () => {
      SessionService.setSession('test-token', { id: 1 });
      await apiService.logout();

      expect(SessionService.getToken()).toBeNull();
      expect(SessionService.getCurrentUser()).toBeNull();
    });
  });

  describe('Protected Routes', () => {
    beforeEach(() => {
      SessionService.setSession('test-token', { id: 1, role: 'user' });
    });

    test('adds auth header to requests', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({})
        })
      );

      await apiService.getProfile();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token'
          })
        })
      );
    });

    test('handles token refresh', async () => {
      const originalToken = 'expired-token';
      const newToken = 'new-token';

      SessionService.setSession(originalToken, { id: 1 });

      global.fetch = jest.fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: false,
            status: 401,
            json: () => Promise.resolve({ message: 'Token expired' })
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ token: newToken })
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({})
          })
        );

      await apiService.getProfile();

      expect(SessionService.getToken()).toBe(newToken);
    });
  });
}); 