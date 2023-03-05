import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import {registerValidation} from "./validations/auth.js";
import {body, validationResult} from "express-validator";
import UserModel from './models/User.js';
import bcrypt from 'bcrypt';

mongoose
    .connect('mongodb+srv://bodybalance:wwwwww@cluster0.st63z74.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));


const app = express();

app.use(express.json()); //научить express читать json

app.post('/auth/login', async (req, res) => {
   try {
       const user = await UserModel.findOne({email: req.body.email});

       if(!user){
           return res.status(404).json({
               message: 'Пользователь не найден', //лучше не уточнять почему от брутфорса
           });
       }

       const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); //сравниваем введеный пароль с паролем в БД дешифруя

       if (!isValidPass){
           return res.status(400).json({
               message: 'Не верный логин или пароль', //лучше не уточнять почему от брутфорса
           });
       }

       //если все ок создаем новый токен
       const token = jwt.sign({
               _id: user._id,
           },
           'secret123',
           { //срок жизни токена
               expiresIn: '30d',
           },
       );

       const {passwordHash, ...userData} = user._doc;

       //если ошибок нет
       res.json({
           ...userData,
           token,
       });

   } catch (err){
       console.log(err);
       res.status(500).json({
           message: 'Не удалось авторизоваться',
       })
   }
});

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req); //вытащить все ошибки из запроса
        if (!errors.isEmpty()){
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10); //генерируем соль
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName:  req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save(); //

        const token = jwt.sign({
            _id: user._id,
        },
            'secret123',
            { //срок жизни токена
               expiresIn: '30d',
            },
        );
        const {passwordHash, ...userData} = user._doc;

        //если ошибок нет
        res.json({
            ...userData,
            token,
        });
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        })
    }
});

app.listen(4444, (err) => { //запустить сервер
   if (err) {
       return console.log(err);
   }

   console.log('Server OK');
});
