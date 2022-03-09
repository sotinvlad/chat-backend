import express from "express";
import DialogModel from "../schemas/Dialog";
import MessageModel from "../schemas/Message";
import { io } from './../index';

class MessageController { 
    index(req: express.Request, res: express.Response) {
        const dialogId = req.query.id;
        MessageModel
        .find({ dialogId: dialogId })
        .populate('user')
        .exec((err: any, Messages: any) => {
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

    create(req: express.Request, res: express.Response) {
        const postData = {
            text: req.body.text,
            dialogId: req.body.dialogId,
            user: req.body.userId
        }
        const Message = new MessageModel(postData);
        Message
        .save()
        .then((data: any) => {
          res.json(data);
          DialogModel.findByIdAndUpdate(postData.dialogId, { lastMessage: data._id  }, (_:any, dialog: any) => {
          })
          MessageModel.populate(data, {path:'user'}, (err, data) => {
              console.log('SERVER:SEND_MESSAGE', data);
            io.to('dialogId:' + postData.dialogId).emit('SERVER:SEND_MESSAGE', data);
          });
        })
        .catch((err: any) => res.send(err));
    }
}

const Message = new MessageController;

export default Message;