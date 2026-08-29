import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

// rejects requests without a valid `Authorization: Bearer <token>` header
const verifyAuthToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new Error('Authorization header is required');
        }
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET as string);
        next();
    } catch (err) {
        res.status(401);
        res.json(`Access denied. Invalid token. Error: ${err}`);
    }
};

export default verifyAuthToken;
