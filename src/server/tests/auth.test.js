const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');

describe('Authentication & Authorization Tests', () => {
  let adminToken, userToken;
  
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  beforeEach(async () => {
    await User.deleteMany({});
    
    // Create test users
    const admin = await User.create({
      email: 'admin@test.com',
      password: 'Admin123!',
      name: 'Admin User',
      role: 'admin'
    });

    const user = await User.create({
      email: 'user@test.com',
      password: 'User123!',
      name: 'Regular User',
      role: 'user'
    });

    adminToken = generateToken(admin);
    userToken = generateToken(user);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('User Registration', () => {
    const validUser = {
      email: 'newuser@test.com',
      password: 'Password123!',
      name: 'New User'
    };

    test('should register new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');

      const user = await User.findOne({ email: validUser.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(validUser.name);
      expect(user.role).toBe('user');
    });

    test('should not register user with existing email', async () => {
      await User.create(validUser);
      
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('already registered');
    });

    test('should validate email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, email: 'invalid-email' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('valid email');
    });

    test('should require password minimum length', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, password: 'short' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('8 characters');
    });
  });

  describe('User Login', () => {
    test('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@test.com',
          password: 'User123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
      expect(res.body.user).toBeTruthy();
    });

    test('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@test.com',
          password: 'WrongPassword123!'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid credentials');
    });

    test('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid credentials');
    });
  });

  describe('Role-Based Access Control', () => {
    test('admin should access admin dashboard', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });

    test('user should not access admin dashboard', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    test('admin should access user management', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });

    test('user should access own profile', async () => {
      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
    });

    test('user should not access other user profiles', async () => {
      const otherUser = await User.create({
        email: 'other@test.com',
        password: 'Password123!',
        name: 'Other User'
      });

      const res = await request(app)
        .get(`/api/user/${otherUser._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Protected Routes', () => {
    test('should require authentication for protected routes', async () => {
      const res = await request(app)
        .get('/api/user/profile');

      expect(res.status).toBe(401);
    });

    test('should reject invalid tokens', async () => {
      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });

    test('should reject expired tokens', async () => {
      const expiredToken = generateToken({ _id: 'userid' }, '0s');
      
      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
    });
  });

  describe('Content Management Access', () => {
    test('admin should create posts', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Test Post',
          content: 'Test content'
        });

      expect(res.status).toBe(201);
    });

    test('user should not create posts without permission', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Test Post',
          content: 'Test content'
        });

      expect(res.status).toBe(403);
    });

    test('admin should upload media', async () => {
      const res = await request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('file', 'test/fixtures/test-image.jpg');

      expect(res.status).toBe(201);
    });

    test('user should not upload media without permission', async () => {
      const res = await request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${userToken}`)
        .attach('file', 'test/fixtures/test-image.jpg');

      expect(res.status).toBe(403);
    });
  });
}); 