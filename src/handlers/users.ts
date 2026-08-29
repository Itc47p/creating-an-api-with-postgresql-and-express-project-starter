import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserStore } from '../models/User';
import verifyAuthToken from '../middleware/verifyAuthToken';

const store = new UserStore();
const { JWT_SECRET } = process.env;

const index = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await store.index();
        res.json(users);
    } catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};

const show = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await store.show(parseInt(req.params.id, 10));
        res.json(user);
    } catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await store.create({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
        });
        const token = jwt.sign({ user }, JWT_SECRET as string);
        res.json({ user, token });
    } catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};

const userRoutes = (app: express.Application): void => {
    app.get('/users', verifyAuthToken, index);
    app.get('/users/:id', verifyAuthToken, show);
    app.post('/users', create);
};

export default userRoutes;
