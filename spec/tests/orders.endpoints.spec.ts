import supertest from 'supertest';
import app from '../../src/server';

const request = supertest(app as unknown as Parameters<typeof supertest>[0]);

describe('Order Endpoints', () => {
    let token: string;
    let userId: number;
    let productId: number;

    beforeAll(async () => {
        const userRes = await request
            .post('/users')
            .send({ username: 'orderendpointuser1', firstName: 'Order', lastName: 'Endpoint', password: 'password123' });
        token = userRes.body.token;
        userId = userRes.body.user.id;

        const productRes = await request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Order Endpoint Widget', price: 500, category: 'gadgets' });
        productId = productRes.body.id;
    });

    it('GET /orders/current/:userId should reject a request without a token', async () => {
        const res = await request.get(`/orders/current/${userId}`);
        expect(res.status).toEqual(401);
    });

    it('GET /orders/current/:userId should return null when no active order exists', async () => {
        const res = await request.get(`/orders/current/${userId}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toEqual(200);
        expect(res.body).toBeNull();
    });

    it('POST /orders/:userId/products should auto-create an active order and flag that it was created', async () => {
        const res = await request
            .post(`/orders/${userId}/products`)
            .set('Authorization', `Bearer ${token}`)
            .send({ productId, quantity: 2 });
        expect(res.status).toEqual(200);
        expect(res.body.orderWasCreated).toBeTrue();
        expect(res.body.order.products.length).toEqual(1);
    });

    it('PATCH /orders/:id/complete should mark the current order as complete', async () => {
        const currentRes = await request.get(`/orders/current/${userId}`).set('Authorization', `Bearer ${token}`);
        const orderId = currentRes.body.id;
        const res = await request.patch(`/orders/${orderId}/complete`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toEqual(200);
        expect(res.body.status).toEqual('complete');
    });

    it('GET /orders/completed/:userId should return the completed order', async () => {
        const res = await request.get(`/orders/completed/${userId}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
