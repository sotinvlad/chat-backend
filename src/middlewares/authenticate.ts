import express from 'express';
import jwt from 'jsonwebtoken';

export default (req: express.Request, res: express.Response, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (req.path == '/login' || req.path == '/user/registration'){
        next();
        return;
    }
    console.log(token);
    if (token == null) return res.sendStatus(401);
    
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '', (err, decodedData) => {
        if (err) return res.status(404).json(err);
        next();
    })
}