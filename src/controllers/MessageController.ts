import express from "express";
import MessageModel from "../schemas/Message";

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

    create(req: express.Request, res: express.Response) {
        console.log(req.body);
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
        })
        .catch((err: any) => res.send(err));
    }
}

export default MessageController;