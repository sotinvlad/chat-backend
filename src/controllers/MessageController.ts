import express from "express";
import DialogModel from "../schemas/Dialog";
import MessageModel from "../schemas/Message";
import { io } from './../index';

class MessageController { 
    get(req: express.Request, res: express.Response) {
        console.log('message.get')
        const dialogId = req.query.id;
        DialogModel.findById(dialogId).populate('lastMessage').populate('dialogParticipants.user').exec((_:any, dialog: any) => {
            dialog.dialogParticipants.forEach((obj: any, index: any, dialogParticipants: any) =>{
              if(obj.user._id.toString() === req.user._id.toString()){
                dialogParticipants[index].unreadedMessages = 0;
              }
            })
            dialog.save().then(() => io.to('dialogId:' + dialog._id).emit('SERVER:UPDATE_DIALOG', dialog));
        })
        MessageModel
        .find({dialogId: dialogId})
        .populate('user')
        .exec((err: any, Messages: any) => {
            if (err){
                return res.status(404).json({
                    message: 'Messages are not found'
                });
            }
            Messages.forEach((msg: any) => {
                if (msg.user._id.toString() !== req.user._id.toString()){
                    if (msg.isReaded === false){
                        msg.isReaded = true;
                        msg.save().then(() => io.to('dialogId:' + dialogId).emit('SERVER:MESSAGE_UPDATE', msg));    
                    }    
                }
            })
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
                DialogModel.findById(message.dialogId).populate('lastMessage').populate('dialogParticipants.user').exec((err, dialog) => {
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
          DialogModel.findById(postData.dialogId).populate('lastMessage').populate('dialogParticipants.user').exec((_:any, dialog: any) => {
            MessageModel.find({$and:[ { dialogId: dialog._id }, { user: postData.user }, { isReaded: false } ]}, (err, messages)=> {
                dialog.dialogParticipants.forEach((obj: any, index: any, dialogParticipants: any) => {
                    if(obj.user._id.toString() !== postData.user){
                        dialogParticipants[index].unreadedMessages = messages.length;
                    }
                })
                dialog.lastMessage = message;
                dialog.dialogParticipants.find((obj: any) => obj.user._id.toString() === postData.user).isTyping = false;
                dialog.save().then(() => io.to('dialogId:' + dialog._id).emit('SERVER:UPDATE_DIALOG', dialog));
            })
            
          })
          MessageModel.populate(message, {path:'user'}, (err, data) => {
            io.to('dialogId:' + postData.dialogId).emit('SERVER:SEND_MESSAGE', data);
          });
        })
        .catch((err: any) => res.send(err));
    }

    update(req: express.Request, res: express.Response){
        const messageId = req.body.id;
        const messageText = req.body.text;
        console.log('message update')
        MessageModel
        .findById(messageId, (err: any, message: any) => {
            if (err) {
                res.json(err);
            }
            if (req.user._id.toString() === message.user.toString()) {
                message.text = messageText;
                message.save().then(() => {
                    io.to('dialogId:' + message.dialogId._id).emit('SERVER:MESSAGE_UPDATE', message);
                    DialogModel.findById(message.dialogId).populate('lastMessage').populate('dialogParticipants.user').exec((err, dialog) => {
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