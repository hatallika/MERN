import express from 'express';
import mongoose from "mongoose";
import multer from 'multer';
import {registerValidation, loginValidation, postCreateValidation} from "./validations/validations.js";
import {checkAuth, handleValidationErrors} from "./utils/index.js";
import {UserController, PostController} from './controllers/index.js';

mongoose
    .connect('mongodb+srv://bodybalance:wwwwww@cluster0.st63z74.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
   //функция объясняет какой путь нужно использовать
   destination: (_, __, cb) => {
       cb(null, 'uploads');
   },
    //функция объяснит как называетс этот файл
    filename: (_, file, cb) => {
       cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json()); //научить express читать json
app.use('/uploads', express.static('uploads')); //читать uploads папку

app.post('/auth/login',loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register',registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);//

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

//роут Стаьи
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(4444, (err) => { //запустить сервер
   if (err) {
       return console.log(err);
   }

   console.log('Server OK');
});
