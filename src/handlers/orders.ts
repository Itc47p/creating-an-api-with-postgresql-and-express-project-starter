import express, { Request, Response } from 'express';
import { OrderStore } from '../models/Order';
import verifyAuthToken from '../middleware/verifyAuthToken';

const store = new OrderStore();

const current = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await store.current(parseInt(req.params.userId, 10));
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};

const completed = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await store.completed(parseInt(req.params.userId, 10));
        res.json(orders);
    } catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};

const addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await store.addProduct(
            parseInt(req.params.userId, 10),
            req.body.productId,
            req.body.quantity
        );
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};

const complete = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await store.complete(parseInt(req.params.id, 10));
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};

const orderRoutes = (app: express.Application): void => {
    app.get('/orders/current/:userId', verifyAuthToken, current);
    app.get('/orders/completed/:userId', verifyAuthToken, completed);
    app.post('/orders/:userId/products', verifyAuthToken, addProduct);
    app.patch('/orders/:id/complete', verifyAuthToken, complete);
};

export default orderRoutes;
