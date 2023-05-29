import express from 'express';
import cors from 'cors';
import fs from 'fs';
import mongoose from "mongoose";
import multer from 'multer';
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
    serviceCreateValidation,
    catalogVideoCreateValidation,
    videoCreateValidation,
    onlineRehabilitationValidation,
    customerCreateValidation,
    appointmentCreateValidation,
    employerCreateValidation, workTimeCreateValidation,
} from "./validations/validations.js";
import {checkAuth, handleValidationErrors} from "./utils/index.js";
import {
    UserController,
    PostController,
    ServiceController,
    OnlineRehabilitationController,
    TrainingController,
    CustomerController,
    AppointmentController,
    EmployerController,
    WorkTimeController,
} from './controllers/index.js';

mongoose

    // .connect('mongodb+srv://bodybalance:wwwwww@cluster0.st63z74.mongodb.net/blog?retryWrites=true&w=majority')
    // .connect('mongodb://127.0.0.1:27017/bodybalance')//local
    .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bodybalance')//environment variables
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    //функция объясняет какой путь нужно использовать
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    //функция объяснит как называетс этот файл
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json()); //научить express читать json
app.use(cors());
app.use('/uploads', express.static('uploads')); //читать uploads папку

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);//
app.get('/users', checkAuth, UserController.getAll);//

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

//получение тегов
app.get('/tags', PostController.getLastTags);
//роут Стаьи
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);

//Услуги
app.get('/services', ServiceController.getAll);
app.get('/services/popular', ServiceController.getByRating);
app.get('/services/:id', ServiceController.getOne);
app.post('/services', checkAuth, serviceCreateValidation, handleValidationErrors, ServiceController.create);


//Онлайн-реабилитация
app.get('/online-rehabilitation', OnlineRehabilitationController.getAll);
app.post('/online-rehabilitation', onlineRehabilitationValidation, handleValidationErrors, OnlineRehabilitationController.create);

//Тренировки
app.get('/training', TrainingController.getCatalog);
app.get('/training/:id', TrainingController.getVideos);

app.post('/training', catalogVideoCreateValidation, handleValidationErrors, TrainingController.createCatalog);
app.post('/video', videoCreateValidation, handleValidationErrors, TrainingController.createVideo);


//Покупатели (записались на услугу, попали на прием, обратились в сервис)
app.get('/customers/auth', UserController.getCustomers); // оболочки
app.get('/customers', CustomerController.getAll); // оболочки
app.get('/customers/:id', CustomerController.getOne);
app.get('/customer/byemail', CustomerController.getOneByEmail); //для клиентской базы
app.get('/customer/byphone', CustomerController.getOneByPhone); //для клиентской базы
app.post('/customers', customerCreateValidation, handleValidationErrors, CustomerController.create);
app.delete('/customers/:id', checkAuth, CustomerController.remove);
app.patch('/customers/:id', checkAuth, customerCreateValidation, handleValidationErrors, CustomerController.update);
app.get('/customers/byuser/:user',checkAuth, CustomerController.findByUser); //есть ли такой пользователь в полкупателях

//Сотрудники
//Покупатели (записались на услугу, попали на прием, обратились в сервис)
app.get('/employers', EmployerController.getAll);
app.get('/employers/:id', EmployerController.getOne);
app.post('/employers', employerCreateValidation, handleValidationErrors, EmployerController.create);
app.delete('/employers/:id', checkAuth, EmployerController.remove);
app.patch('/employers/:id', checkAuth, employerCreateValidation, handleValidationErrors, EmployerController.update);

//Запись на прием
//Покупатели (записались на услугу, попали на прием, обратились в сервис)
app.get('/appointments', AppointmentController.getAll);
app.get('/appointments/:id', AppointmentController.getOne);
app.post('/appointments', appointmentCreateValidation, handleValidationErrors, AppointmentController.create);
app.delete('/appointments/:id', checkAuth, AppointmentController.remove);
app.patch('/appointments/:id', checkAuth, appointmentCreateValidation, handleValidationErrors, AppointmentController.update);

//Рабочие часы сотрудников
app.get('/worktime', WorkTimeController.getAll);
app.get('/worktime/employer/:id', WorkTimeController.getByEmployer);
app.post('/worktime', workTimeCreateValidation, handleValidationErrors, WorkTimeController.create);
//Сервер
app.listen(process.env.PORT || 4444, (err) => { //запустить сервер
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
