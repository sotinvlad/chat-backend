import express from "express";
import bcrypt from 'bcrypt';
import validate from 'validate';

import UserModel from "../schemas/User";
import registerValidator from "../utils/registerValidator";



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

    async create(req: express.Request, res: express.Response) {
        
        const postData = {
          email: req.body.email,
          password: req.body.password,
          fullname: req.body.fullname
        }
        if (registerValidator(postData) === false){
            res.status(406).send({msg:'Некорректные данные'});
        } else {
            postData.password = await bcrypt.hash(req.body.password, 10);
            const user = new UserModel(postData);
            user
            .save()
            .then((data: any) => {
              res.json({msg: 'Регистрация успешна'});
            })
            .catch((err: any) => {
                res.status(404).send({msg: 'Ошибка при создании пользователя'})
            });
        }
        
    }

    search(req: express.Request, res: express.Response) {
        const str = req.body.str;
        UserModel.find({$or: [{ 'fullname': { "$regex": str, "$options": "i" }},{ 'email': { "$regex": str, "$options": "i" }}]}, (err, users) => {
            if (err){
                return res.status(404).json({
                    message: 'Users is not found'
                });
                
            }
            res.json(users);
        })
    }
}

const User = new UserController;

export default User;