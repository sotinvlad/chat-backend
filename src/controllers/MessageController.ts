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
        MessageModel.findById(id, (err: any, message: any) => {
            if (err){
                return res.status(404).json({
                    message: 'Message is not found'
                });      
            }
            if (req.user._id.toString() === message.user.toString()) {
                message.remove();
                io.to('dialogId:' + message.dialogId).emit('SERVER:MESSAGE_DELETE', message._id);
                DialogModel.findById(message.dialogId).populate('lastMessage').populate('dialogParticipants').exec((err, dialog) => {
                    MessageModel.findOne({dialogId: dialog._id}).sort('-createdAt').exec((err, msg) => {
                        if (msg) {
                            dialog.lastMessage = msg;
                            dialog.save().then(() => {
                                io.to('dialogId:' + dialog._id).emit('SERVER:UPDATE_DIALOG', dialog);
                            })
                            
                        } else {
                            dialog.lastMessage = null;
                            dialog.save().then(() => {
                                io.to('dialogId:' + dialog._id).emit('SERVER:UPDATE_DIALOG', dialog);
                            })  
                        }
                    });
                    
                })
            } else {
                res.status(401).json({
                    status: 'error',
                    message: 'deleting message is not allowed'
                })
            }
            
            return res.json({ message: 'Message is deleted' });
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
        .then((message: any) => {
          res.json(message);
          DialogModel.findById(postData.dialogId).populate('lastMessage').populate('dialogParticipants').exec((_:any, dialog: any) => {
            dialog.lastMessage = message;
            dialog.save();
            io.to('dialogId:' + dialog._id).emit('SERVER:UPDATE_DIALOG', dialog);
          })
          MessageModel.populate(message, {path:'user'}, (err, data) => {
              console.log('SERVER:SEND_MESSAGE', data);
            io.to('dialogId:' + postData.dialogId).emit('SERVER:SEND_MESSAGE', data);
          });
        })
        .catch((err: any) => res.send(err));
    }

    update(req: express.Request, res: express.Response){
        const messageId = req.body.id;
        const messageText = req.body.text;
        MessageModel
        .findById(messageId, (err: any, message: any) => {
            if (err) {
                res.json(err);
            }
            if (req.user._id.toString() === message.user.toString()) {
                message.text = messageText;
                message.save().then(() => {
                    io.to('dialogId:' + message.dialogId._id).emit('SERVER:MESSAGE_UPDATE', message);
                    DialogModel.findById(message.dialogId).populate('lastMessage').populate('dialogParticipants').exec((err, dialog) => {
                        io.to('dialogId:' + dialog._id).emit('SERVER:UPDATE_DIALOG', dialog);
                    })
                })
            } else {
                res.status(401).json({
                    status: 'error',
                    message: 'updating message is not allowed'
                })
            }
        })
    }
}

const Message = new MessageController;

export default Message;