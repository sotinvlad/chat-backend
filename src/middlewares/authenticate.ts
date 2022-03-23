import express from 'express';
import jwt from 'jsonwebtoken';
import UserModel from './../schemas/User';

const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (req.path == '/user/login' || req.path == '/user/registration' || req.path.includes('/file')){
        next();
        return;
    }
    if (token == null) return res.sendStatus(401);


    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '', (err: any, decodedData: any) => {
        if (err) return res.status(401).json(err);
        if (decodedData){
            UserModel.findOneAndUpdate({ email: decodedData.email },{ last_seen: new Date() }, { new: true }, (_:any, user: any) => {
                if (err){
                    res.status(401).json(err);
                }
                req.user = user;
                next();
            })
        } else {
            next();
        }
    })
}

export default authenticate;