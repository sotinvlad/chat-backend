import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import { instrument } from '@socket.io/admin-ui';

import createJWT from './utils/createJWT'
import authenticate from './middlewares/authenticate';
import createSocketServer from './core/socket';
import Message from './controllers/MessageController';
import User from './controllers/UserController';
import Dialog from './controllers/DialogController';

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(cors());
app.use(authenticate);
const server = http.createServer(app);
export const io = createSocketServer(server);
mongoose.connect('mongodb://localhost:27017/chat');

app.post('/user/login', createJWT);
app.post('/user/registration', User.create);
app.get('/user/:id', User.index);
app.post('/user/search', User.search);
app.delete('/user/:id', User.delete);

app.get('/dialogs/:id', Dialog.index);
app.post('/dialogs', Dialog.create);
app.delete('/dialogs/:id', Dialog.delete);
app.get('/dialog/:id', Dialog.get);

app.get('/messages', Message.index);
app.post('/messages', Message.create);
app.delete('/messages', Message.delete);
app.put('/messages', Message.update);


instrument(io, { auth: false });

server.listen(port, () => {
  console.log(`Chat backend listening at http://localhost:${port}`)
})

