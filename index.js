import express from 'express';
import cors from 'cors';
import fs from 'fs';
import mongoose from "mongoose";
import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import path from "path";

import {
    registerValidation,
    loginValidation,
    serviceCreateValidation,
    catalogVideoCreateValidation,
    videoCreateValidation,
    onlineRehabilitationValidation,
    customerCreateValidation,
    appointmentCreateValidation,
    employerCreateValidation,
    workTimeCreateValidation,
    ConsultationRecordCreateValidation,
    createPatientCardValidation, createNewUserValidation,
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
    ConsultationTopicController,
    ConsultationRecordController,
    PatientCardController
} from './controllers/index.js';

mongoose

    // .connect('mongodb+srv://bodybalance:wwwwww@cluster0.st63z74.mongodb.net/blog?retryWrites=true&w=majority')
    // .connect('mongodb://127.0.0.1:27017/bodybalance')//local
    .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bodybalance')//environment variables
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    //путь
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads/avatars')) {
            fs.mkdirSync('uploads/avatars');
        }
        cb(null, 'uploads/avatars');
    },
    //название файла
    filename: (_, file, cb) => {
        cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({storage});

app.use(express.json()); //научить express читать json
app.use(cors());
app.use('/uploads', express.static('uploads')); //читать uploads папку

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/users', checkAuth, UserController.getAll);

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

//Контакты - получение
app.get('/contacts', ConsultationTopicController.getAll);
app.post('/contacts', ConsultationRecordCreateValidation, handleValidationErrors, ConsultationRecordController.create);

//ADMIN -- ВЫГРУЗКА КОНСУЛЬТАЦИЙ --- ЗАПИСИ ИЗ КОНТАКТОВ
app.get('/admin/consultations', ConsultationRecordController.getAll);
app.patch("/admin/consultations/updateStatus", handleValidationErrors, ConsultationRecordController.updateStatus);

//ADMIN -- СОЗДАНИЕ КАРТОЧКИ ПАЦИЕНТА
app.get('/admin/patientCards', handleValidationErrors, PatientCardController.getAll);
app.get('/admin/customers', handleValidationErrors, UserController.getAllCustomers);
app.post('/admin/customers', createPatientCardValidation, handleValidationErrors, PatientCardController.createPatientCard);
app.patch('/admin/customers/:cardId', handleValidationErrors, PatientCardController.updatePatientCard);
app.post('/admin/customers/newCustomer',createNewUserValidation,  handleValidationErrors, UserController.createUserAndGeneratePassword)

//ИЗМЕНЕНИЕ ПАРОЛЯ ДЛЯ НОВОГО ПОЛЬЗОВАТЕЛЯ
app.patch('/resetPassword/:token',handleValidationErrors, UserController.resetPassword)

//Тренировки
app.get('/training', TrainingController.getCatalog);
app.get('/training/:id', TrainingController.getVideos);

app.post('/training', catalogVideoCreateValidation, handleValidationErrors, TrainingController.createCatalog);
app.post('/video', videoCreateValidation, handleValidationErrors, TrainingController.createVideo);

app.get('/customers/:id', CustomerController.getOne);
app.get('/customer/byemail', CustomerController.getOneByEmail); //для клиентской базы
app.get('/customer/byphone', CustomerController.getOneByPhone); //для клиентской базы
app.delete('/customers/:id', checkAuth, CustomerController.remove);
app.get('/customers/byuser/:user', checkAuth, CustomerController.findByUser); //есть ли такой пользователь в полкупателях

//ПРОФИЛЬ --- СОЗДАНИЕ customer ОБНОВЛЕНИЕ ДАННЫХ
app.post('/customers', customerCreateValidation, handleValidationErrors, CustomerController.create);
app.patch('/customers/:id', checkAuth, customerCreateValidation, handleValidationErrors, CustomerController.update);
app.get('/profile', CustomerController.getAll); // вернуть всех кастомеров
app.patch('/profile/updateAvatar', checkAuth, upload.single('image'), UserController.update); //ЗАГРУЗКА АВАТАРКИ (с заменой)

//Сотрудники
//Покупатели (записались на услугу, попали на прием, обратились в сервис)
app.get('/employers/auth', UserController.getEmployers); // Users with role: employer
app.get('/employers', EmployerController.getAll);// оболочки
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
app.get('/appointments/employer/:id', AppointmentController.getByEmployer);

//Рабочие часы сотрудников
app.get('/worktime', WorkTimeController.getAll);
app.get('/worktime/employer/:id', WorkTimeController.getByEmployer);
app.post('/worktime', workTimeCreateValidation, handleValidationErrors, WorkTimeController.create);


//Сброс пароля


//Сервер
app.listen(process.env.PORT || 4444, (err) => { //запустить сервер
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});