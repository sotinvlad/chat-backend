import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../schemas/User';
import { decodeRailFenceCipher } from './encoderDecoder';

export default async (req: express.Request, res: express.Response) => {

  const data = {
    email: req.body.email,
    password: decodeRailFenceCipher(req.body.password,3)
  }
  console.log(data)
  UserModel.findOne({ email: data.email }, (err: any, user: any) => {
    if (err){
        return res.status(500).json({
            message: 'Internal error'
        });
    }
    console.log('login', data.password, user.password);
    console.log(bcrypt.compareSync(data.password, user.password));

    if (user && bcrypt.compareSync(data.password, user.password)) {
      const dataToSign = {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        password: user.password, 
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        last_seen: user.last_seen
      }
      const accessToken = jwt.sign(dataToSign, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '7d' })

      res.json({
        accessToken: accessToken,
        user: user
      })
    } else {
        res.status(404).json({ 
          message: 'Wrong email or password'
        })
    }
})
}
