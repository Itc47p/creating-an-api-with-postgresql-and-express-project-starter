import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../src/server';

const request = supertest(app as unknown as Parameters<typeof supertest>[0]);
const token = jwt.sign({ user: {} }, process.env.JWT_SECRET as string);

describe('Product Endpoints', () => {
    let productId: number;

    it('POST /products should reject a request without a token', async () => {
        const res = await request.post('/products').send({ name: 'Test', price: 100 });
        expect(res.status).toEqual(401);
    });

    it('POST /products should create a product given a valid token', async () => {
        const res = await request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Endpoint Widget', price: 1200, category: 'gadgets' });
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('Endpoint Widget');
        productId = res.body.id;
    });

    it('GET /products should return a list including the created product', async () => {
        const res = await request.get('/products');
        expect(res.status).toEqual(200);
        expect(res.body.some((p: { id: number }) => p.id === productId)).toBeTrue();
    });

    it('GET /products/:id should return the created product', async () => {
        const res = await request.get(`/products/${productId}`);
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('Endpoint Widget');
    });

    it('GET /products/category/:category should return products in that category', async () => {
        const res = await request.get('/products/category/gadgets');
        expect(res.status).toEqual(200);
        expect(res.body.some((p: { id: number }) => p.id === productId)).toBeTrue();
    });
});
