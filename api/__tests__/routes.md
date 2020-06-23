import request from 'supertest';
import { server } from '../src/server';

describe('GET /', () => {
  it('receive correct welcome message', async () => {
    await request(server)
      .get('/api/')
      .expect('Content-Type', /json/)
      .expect(200, { message: 'Bienvenido a la NRS Blockchain API' });
  });
});

describe('POST /auth', () => {
  it('login user', async () => {
    await request(server)
      .post('/auth/')
      .send({
        email: 'info@nuclearis.com',
        passphrase: 'Nuclearis'
      })
      .expect(200);
  });
});
