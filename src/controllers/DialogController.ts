import express from "express";
import DialogModel from "../schemas/Dialog";

class DialogController { 
    index(req: express.Request, res: express.Response) {
        const creatorId: String = req.params.id;
        DialogModel.where({'dialogParticipants': creatorId}).populate('dialogParticipants').find((err: any, dialog: any) => {
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
        DialogModel.findByIdAndDelete(id, (err: any, user: any) => {
            if (err){
                return res.status(404).json({
                    message: 'Dialog is not found'
                });      
            }
            res.json(`Dialog has been deleted`);
        })
    }

    create(req: express.Request, res: express.Response) {
        const postData = {
            dialogParticipants: req.body.dialogParticipants
        }
        const dialog = new DialogModel(postData);
        dialog
        .save()
        .then((data: any) => {
          res.json(data);
        })
        .catch((err: any) => res.send(err));
    }
}

export default DialogController;