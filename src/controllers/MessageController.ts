import express from "express";
import MessageModel from "../schemas/Message";
import { io } from './../index';

class MessageController { 
    index(req: express.Request, res: express.Response) {
        const dialogId = req.query.id;
        MessageModel.find({ dialog: dialogId },(err: any, Messages: any) => {
            if (err){
                return res.status(404).json({
                    message: 'Messages are not found'
                });
                
            }
            res.json(Messages);
        })
    }

    delete(req: express.Request, res: express.Response) {
        const id = req.query.id;
        MessageModel.findByIdAndDelete(id, (err: any, user: any) => {
            if (err){
                return res.status(404).json({
                    message: 'Message is not found'
                });      
            }
            res.json(`Message has been deleted`);
        })
    }
    // io.on('connection', (socket: any) => {
    //     console.log('a user connected, socket: ', socket.id);
    //     socket.on('USER_SEND_MESSAGE', (message :any) => {
    //       console.log(message);
    //       io.emit('MESSAGE_RECEIVED', message);
    //     })
    //     socket.emit('SERVER_SEND_MESSAGE', 'welcome');
    //   });

    create(req: express.Request, res: express.Response) {
        const postData = {
            text: req.body.text,
            dialogId: req.body.dialogId,
            userId: req.body.userId
        }
        const Message = new MessageModel(postData);
        Message
        .save()
        .then((data: any) => {
          res.json(data);
          io.emit('SERVER:SEND_MESSAGE', data);
        })
        .catch((err: any) => res.send(err));
    }
}

export default MessageController;