import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';


import UserController from './controllers/UserController';
import DialogController from './controllers/DialogController';
import MessageController from './controllers/MessageController';
import createJWT from './utils/createJWT'

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/chat');

const User = new UserController;
const Dialog = new DialogController;
const Message = new MessageController;

app.get('/user/:id', User.index);
app.post('/user/registration', User.create);
app.delete('/user/:id', User.delete);

app.get('/dialogs/:id', Dialog.index)
app.post('/dialogs', Dialog.create)
app.delete('/dialogs/:id', Dialog.delete);

app.get('/messages', Message.index)
app.post('/messages', Message.create)
app.delete('/messages', Message.delete);

app.post('/login', createJWT)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

