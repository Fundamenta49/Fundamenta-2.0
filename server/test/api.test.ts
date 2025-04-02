import { describe, it, expect } from 'vitest';
import { app } from '../index';

describe('API Tests', () => {
  it('health check endpoint should return 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });
    
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ status: 'ok' });
  });
}); 