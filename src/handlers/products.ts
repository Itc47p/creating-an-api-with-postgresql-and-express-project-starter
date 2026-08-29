import express, { Request, Response } from 'express';
import { ProductStore } from '../models/Product';
import verifyAuthToken from '../middleware/verifyAuthToken';

const store = new ProductStore();

const index = async (_req: Request, res: Response): Promise<void> => {
    try {
        const products = await store.index();
        res.json(products);
    } catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};

const show = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await store.show(parseInt(req.params.id, 10));
        res.json(product);
    } catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await store.create({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
        });
        res.json(product);
    } catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};

const byCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await store.byCategory(req.params.category);
        res.json(products);
    } catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};

const destroy = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await store.delete(parseInt(req.params.id, 10));
        res.json(product);
    } catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};

const productRoutes = (app: express.Application): void => {
    app.get('/products', index);
    app.get('/products/category/:category', byCategory);
    app.get('/products/:id', show);
    app.post('/products', verifyAuthToken, create);
    app.delete('/products/:id', verifyAuthToken, destroy);
};

export default productRoutes;
