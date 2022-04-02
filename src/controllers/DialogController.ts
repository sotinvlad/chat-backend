import express from "express";
import DialogModel from "../schemas/Dialog";
import { io } from './../index';

class DialogController { 
    index(req: express.Request, res: express.Response) {
        const userId: String = req.params.id;
        DialogModel.where({'dialogParticipants.user': userId}).populate('dialogParticipants.user').populate('lastMessage').find((err: any, dialog: any) => {
            if (err){
                return res.status(404).json({
                    message: 'Dialogs are not found'
                });
            }
            res.json(dialog);
        })
    }

    delete(req: express.Request, res: express.Response) {
        const id: String = req.params.id;
        DialogModel.findByIdAndDelete(id, (err: any, dialog: any) => {
            if (err){
                return res.status(404).json({
                    message: 'Dialog is not found'
                });      
            }
            console.log(dialog)
            io.to('dialogId:' + dialog._id).emit('SERVER:DIALOG_DELETED', dialog._id);
            res.json(`Dialog has been deleted`);
        })
    }

    create(req: express.Request, res: express.Response) {
        const postData = {
            dialogParticipants: req.body.dialogParticipants.map((p:any) => {return ({user: p, unreadedMessages: 0})})
        }
        const dialog = new DialogModel(postData);
        dialog
        .save()
        .then((data: any) => {
          res.json(data);
          io.emit('SERVER:DIALOG_CREATED');
        })
        .catch((err: any) => res.send(err));
    }

    get(req: express.Request, res: express.Response) {
        const id: String = req.params.id;
        DialogModel.findById(id).populate('dialogParticipants.user').populate('lastMessage').exec((err: any, dialog: any) => {
            if (err){
                return res.status(404).json({
                    message: 'Dialog is not found'
                });      
            }
            res.json(dialog);
        })
    }
}

const Dialog = new DialogController;

export default Dialog;