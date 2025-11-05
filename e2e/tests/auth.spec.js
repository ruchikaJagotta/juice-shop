import { test, expect } from '../fixtures/test.fixture.js';
import { userData } from '../data/user.js';
import { getRandomEmail } from '../utils/randomEmailGenerator.js';

test.describe('Authentication API Tests', () => {
  test('should register a new user successfully', async ({ authService }) => {
    const testUser = {
      ...userData,
      email: getRandomEmail(),
    };

    const response = await authService.register(testUser);

    expect(response.status()).toEqual(201);
    let body = await response.json();
    expect(body.status).toBe('success');
    expect(body.data.email).toEqual(testUser.email);
    expect(body.data.role).toEqual('customer');
  });

   test('should login with valid credentials', async ({ authService }) => {
    const testUser = {
      ...userData,
      email: getRandomEmail(),
    };

    await authService.register(testUser);
    const loginResponse = await authService.login({
      email: testUser.email,
      password: testUser.password,
    });

    expect(loginResponse.authentication.token).toBeTruthy();
    expect(loginResponse.authentication.bid).toBeGreaterThan(0);
    expect(loginResponse.authentication.umail).toEqual(testUser.email);
  });

   test('should fail login with invalid credentials', async ({ request }) => {
    const response = await request.post('/rest/user/login', {
      data: {
        email: 'nonexistent@test.com',
        password: 'WrongPassword123',
      },
    });

    expect(response.status()).toBe(401);
    const body = await response.text();
    expect(body).toContain('Invalid email or password');
  });
});