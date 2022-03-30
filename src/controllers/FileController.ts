import express from "express";

import { io } from "./../index";
import MessageModel from "../schemas/Message";
import uploadsFolderPath from "../uploads/uploads";

class FileController { 
    upload(req: any, res: express.Response) {
        console.log('upload req')
        const messageId = req.params.id;
        const attachments = req.files.files.map((file: any) => file.filename);
        MessageModel
        .findById(messageId)
        .populate('user')
        .exec((err: any, message) => {
            if(!err){
                message.attachments = attachments;
                message.save().then((msg: any) => {
                    io.to('dialogId:' + message.dialogId).emit('SERVER:MESSAGE_UPDATE', msg);
                })
                res.json({ message: 'file uploaded successfully'});
            } else {
                res.status(500).json({ message: 'file uploading failed' });
            }
        })
    }

    get(req: express.Request, res: express.Response){
        const filename = req.params.filename;
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.download(`${uploadsFolderPath}\\${filename}`);
    }
}

const File = new FileController;

export default File;