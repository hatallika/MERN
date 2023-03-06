import express from 'express';
import mongoose from "mongoose";
import {registerValidation} from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";

mongoose
    .connect('mongodb+srv://bodybalance:wwwwww@cluster0.st63z74.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));


const app = express();

app.use(express.json()); //научить express читать json

app.post('/auth/login', UserController.login);

app.post('/auth/register', registerValidation, UserController.register);

app.get('/auth/me', checkAuth, UserController.getMe);

app.listen(4444, (err) => { //запустить сервер
   if (err) {
       return console.log(err);
   }

   console.log('Server OK');
});
