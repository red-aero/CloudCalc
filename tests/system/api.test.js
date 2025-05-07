/**
 * System tests for the CloudCalc API
 * These tests are designed to run against a deployed instance of the application
 *
 * Note: These tests require the 'supertest' package to be installed:
 * npm install --save-dev supertest
 */

let request;
let skipTests = false;

try {
  request = require('supertest');
} catch (error) {
  // Supertest is not installed, skip these tests
  console.warn('Supertest is not installed. System tests will be skipped.');
  skipTests = true;
}

// Create a dummy test if supertest is not installed
if (skipTests) {
  describe('System Tests (SKIPPED)', () => {
    test('Supertest is not installed', () => {
      console.log('Skipping system tests because supertest is not installed.');
      expect(true).toBe(true);
    });
  });
}

// Only run the actual tests if supertest is installed
if (!skipTests) {
  // Base URL for the deployed application
  // This should be configured based on your deployment environment
  const BASE_URL = process.env.API_URL || 'http://localhost:3001';

  // Test user credentials
  const TEST_USER = {
    username: 'testuser_' + Math.floor(Math.random() * 10000),
    password: 'Test@123'
  };

  // Store the authentication token
  let authToken;

  // User API tests
  describe('User API', () => {
  // Test user registration
  test('should register a new user', async () => {
    const response = await request(BASE_URL)
      .post('/api/register')
      .send(TEST_USER)
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User registered successfully');
  });

  // Test user login
  test('should login a registered user', async () => {
    const response = await request(BASE_URL)
      .post('/api/login')
      .send(TEST_USER)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.user.username).toBe(TEST_USER.username);
    expect(response.body.token).toBeDefined();

    // Store the token for subsequent tests
    authToken = response.body.token;
  });

  // Test invalid login
  test('should reject invalid login credentials', async () => {
    const response = await request(BASE_URL)
      .post('/api/login')
      .send({
        username: TEST_USER.username,
        password: 'wrongpassword'
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

// History API tests
describe('History API', () => {
  // Test adding history item
  test('should add a history item', async () => {
    // Skip if no auth token
    if (!authToken) {
      console.warn('Skipping test: No auth token available');
      return;
    }

    const historyItem = {
      expression: '2 + 3',
      result: '5'
    };

    const response = await request(BASE_URL)
      .post('/api/history')
      .send(historyItem)
      .set('Authorization', `Bearer ${authToken}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.item.expression).toBe(historyItem.expression);
    expect(response.body.item.result).toBe(historyItem.result);
  });

  // Test getting history
  test('should get user history', async () => {
    // Skip if no auth token
    if (!authToken) {
      console.warn('Skipping test: No auth token available');
      return;
    }

    const response = await request(BASE_URL)
      .get('/api/history')
      .set('Authorization', `Bearer ${authToken}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.history)).toBe(true);

    // Should have at least one item (from previous test)
    expect(response.body.history.length).toBeGreaterThan(0);
  });

  // Test clearing history
  test('should clear user history', async () => {
    // Skip if no auth token
    if (!authToken) {
      console.warn('Skipping test: No auth token available');
      return;
    }

    const response = await request(BASE_URL)
      .delete('/api/history')
      .set('Authorization', `Bearer ${authToken}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    // Verify history is cleared
    const getResponse = await request(BASE_URL)
      .get('/api/history')
      .set('Authorization', `Bearer ${authToken}`)
      .set('Accept', 'application/json');

    expect(getResponse.body.history.length).toBe(0);
  });
});

// Unit conversion API tests
describe('Unit Conversion API', () => {
  // Test length conversion
  test('should convert length units', async () => {
    const conversionData = {
      category: 'length',
      fromUnit: 'm',
      toUnit: 'cm',
      value: 1
    };

    const response = await request(BASE_URL)
      .post('/api/convert')
      .send(conversionData)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.result).toBe(100);
  });

  // Test temperature conversion
  test('should convert temperature units', async () => {
    const conversionData = {
      category: 'temperature',
      fromUnit: 'celsius',
      toUnit: 'fahrenheit',
      value: 0
    };

    const response = await request(BASE_URL)
      .post('/api/convert')
      .send(conversionData)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.result).toBe(32);
  });

  // Test invalid conversion
  test('should handle invalid conversion parameters', async () => {
    const conversionData = {
      category: 'length',
      fromUnit: 'invalid',
      toUnit: 'cm',
      value: 1
    };

    const response = await request(BASE_URL)
      .post('/api/convert')
      .send(conversionData)
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

// Logout test
describe('Logout API', () => {
  test('should logout a user', async () => {
    // Skip if no auth token
    if (!authToken) {
      console.warn('Skipping test: No auth token available');
      return;
    }

    const response = await request(BASE_URL)
      .post('/api/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Logout successful');

    // Verify token is invalidated
    const historyResponse = await request(BASE_URL)
      .get('/api/history')
      .set('Authorization', `Bearer ${authToken}`)
      .set('Accept', 'application/json');

    expect(historyResponse.status).toBe(401);
  });
});
