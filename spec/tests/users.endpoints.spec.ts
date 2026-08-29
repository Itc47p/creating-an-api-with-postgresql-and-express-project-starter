import supertest from 'supertest';
import app from '../../src/server';

const request = supertest(app as unknown as Parameters<typeof supertest>[0]);

describe('User Endpoints', () => {
    let token: string;
    let userId: number;

    it('POST /users should create a user and return a token', async () => {
        const res = await request
            .post('/users')
            .send({ username: 'endpointuser1', firstName: 'End', lastName: 'Point', password: 'password123' });
        expect(res.status).toEqual(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.username).toEqual('endpointuser1');
        expect(res.body.user.password).toBeUndefined();
        token = res.body.token;
        userId = res.body.user.id;
    });

    it('GET /users should reject a request without a token', async () => {
        const res = await request.get('/users');
        expect(res.status).toEqual(401);
    });

    it('GET /users should return a list of users given a valid token', async () => {
        const res = await request.get('/users').set('Authorization', `Bearer ${token}`);
        expect(res.status).toEqual(200);
        expect(res.body.some((u: { id: number }) => u.id === userId)).toBeTrue();
    });

    it('GET /users/:id should return the created user given a valid token', async () => {
        const res = await request.get(`/users/${userId}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toEqual(200);
        expect(res.body.username).toEqual('endpointuser1');
    });
});
