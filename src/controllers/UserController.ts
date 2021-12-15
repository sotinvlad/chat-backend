import express from "express";
import UserModel from "../schemas/User";


class UserController { 
    index(req: express.Request, res: express.Response) {
        const id: String = req.params.id;
        UserModel.findById(id, (err: any, user: any) => {
            if (err){
                return res.status(404).json({
                    message: 'User is not found'
                });
                
            }
            res.json(user);
        })
    }

    delete(req: express.Request, res: express.Response) {
        const id: String = req.params.id;
        UserModel.findByIdAndDelete(id, (err: any, user: any) => {
            if (err){
                return res.status(404).json({
                    message: 'User is not found'
                });      
            }
            res.json(`User ${user?.fullname} is deleted`);
        })
    }

    create(req: express.Request, res: express.Response) {
        const postData = {
          email: req.body.email,
          password: req.body.password,
          fullname: req.body.fullname
        }
        const user = new UserModel(postData);
        user
        .save()
        .then((data: any) => {
          res.json(data);
        })
        .catch((err: any) => res.send(err));
    }
}

export default UserController;