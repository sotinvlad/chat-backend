import express from 'express';
import jwt from 'jsonwebtoken';

export default (req: express.Request, res: express.Response) => {

  const user = {
    email: req.body.email,
    password: req.body.password
  }

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || '')

  res.json({
    accessToken: accessToken
  })
  
}
