import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import {avatarUpload, serviceImageUpload, trainingImageUpload} from './config/multerConfig.js';

import {
    registerValidation,
    loginValidation,
    serviceCreateValidation,
    catalogVideoCreateValidation,
    videoCreateValidation,
    onlineRehabilitationValidation,
    customerCreateValidation,
    appointmentCreateValidation,
    consultationRecordCreateValidation,
    createPatientCardValidation,
    createNewUserValidation,
    ScheduleCreateValidation, eventCreateValidation,
} from "./validations/validations.js";
import {checkAuth, handleValidationErrors} from "./utils/index.js";
import {
    UserController,
    ServiceController,
    OnlineRehabilitationController,
    TrainingController,
    CustomerController,
    AppointmentController,
    EmployerController,
    ScheduleController,
    ConsultationTopicController,
    ConsultationRecordController,
    PatientCardController,
    EventController,
} from './controllers/index.js';
import {deleteProfile} from "./controllers/UserController.js";

mongoose

    // .connect('mongodb+srv://bodybalance:wwwwww@cluster0.st63z74.mongodb.net/blog?retryWrites=true&w=majority')
    // .connect('mongodb://127.0.0.1:27017/bodybalance')//local
    .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bodybalance')//environment variables
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/uploads/images/services', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/users', checkAuth, UserController.getAll);

//УСЛУГИ
app.get('/services', ServiceController.getAll);
app.post('/admin/services/newService', checkAuth, serviceCreateValidation, handleValidationErrors, ServiceController.create);
app.delete('/admin/services/removeService/:id', checkAuth, handleValidationErrors, ServiceController.remove);
app.patch('/admin/services/updateService/:id', checkAuth, serviceCreateValidation, handleValidationErrors, ServiceController.update);
app.patch('/admin/services/updateImage/:id', checkAuth, serviceImageUpload.single('image'), ServiceController.updateImage);

//Онлайн-реабилитация
app.get('/online-rehabilitation', OnlineRehabilitationController.getAll);
app.post('/online-rehabilitation', onlineRehabilitationValidation, handleValidationErrors, OnlineRehabilitationController.create);

//Контакты - получение
app.get('/contacts', ConsultationTopicController.getAll);
app.post('/contacts', consultationRecordCreateValidation, handleValidationErrors, ConsultationRecordController.create);

//ADMIN -- ВЫГРУЗКА КОНСУЛЬТАЦИЙ --- ЗАПИСИ ИЗ КОНТАКТОВ
app.get('/admin/consultations', ConsultationRecordController.getAll);
app.patch("/admin/consultations/updateStatus", handleValidationErrors, ConsultationRecordController.updateStatus);

//ADMIN -- ПАЦИЕНТА
app.get('/admin/patientCards', handleValidationErrors, PatientCardController.getAll);
app.get('/admin/customers', handleValidationErrors, UserController.getAllCustomers);
app.post('/admin/customers', createPatientCardValidation, handleValidationErrors, PatientCardController.createPatientCard);
app.patch('/admin/customers/:cardId', handleValidationErrors, PatientCardController.updatePatientCard);
app.post('/admin/customers/newCustomer', createNewUserValidation, handleValidationErrors, UserController.createUserAndGeneratePassword)
app.delete('/admin/customers/removeCustomer/:id', checkAuth, handleValidationErrors, UserController.remove);

//ADMIN -- СПЕЦИАЛИСТЫ -- SPECIALISTS
app.post('/admin/specialists/newEmployer', handleValidationErrors, EmployerController.create);
app.delete('/admin/specialists/removeEmployer/:id', checkAuth, handleValidationErrors, EmployerController.remove);
app.patch('/admin/specialists/updateEmployer/:id', handleValidationErrors, UserController.updateEmployer)

//РАСПИСАНИЕ
app.post('/admin/specialists/:employerId/schedules', ScheduleCreateValidation, handleValidationErrors, ScheduleController.create);
app.get('/admin/specialists/schedules', handleValidationErrors, ScheduleController.getAll);
app.patch('/admin/schedules/:scheduleId', handleValidationErrors, ScheduleController.update);
app.delete(`/admin/schedules/:scheduleId`, checkAuth, handleValidationErrors, ScheduleController.remove);

//СОТРУДНИКИ
app.get('/employers', handleValidationErrors, UserController.getAllEmployers);

app.get('/customers/:id', CustomerController.getOne);
app.get('/customer/byemail', CustomerController.getOneByEmail); //для клиентской базы
app.get('/customer/byphone', CustomerController.getOneByPhone); //для клиентской базы
app.delete('/customers/:id', checkAuth, CustomerController.remove);
app.get('/customers/byuser/:user', checkAuth, CustomerController.findByUser); //есть ли такой пользователь в полкупателях

//ПРОФИЛЬ --- СОЗДАНИЕ customer ОБНОВЛЕНИЕ ДАННЫХ
app.post('/customers', customerCreateValidation, handleValidationErrors, CustomerController.create);
app.patch('/customers/:id', checkAuth, customerCreateValidation, handleValidationErrors, CustomerController.update);
app.get('/profile', CustomerController.getAll);
app.patch('/profile/updateAvatar/:id', checkAuth, avatarUpload.single('image'), UserController.updateAvatar); //ЗАГРУЗКА АВАТАРКИ (с заменой)
app.patch('/profile/changePassword/', checkAuth, UserController.changePassword);
app.delete('/profile/delete/', checkAuth, handleValidationErrors, UserController.deleteProfile);

//ТРЕНИРОВКИ - КАТАЛОГ - ВИДЕО
app.get('/training', TrainingController.getCatalogs);
// app.get('/training/:id', TrainingController.getVideos);
// КАТАЛОГ
app.post('/admin/training/newCatalog', checkAuth, catalogVideoCreateValidation, handleValidationErrors, TrainingController.createCatalog);
app.delete(`/admin/training/:id`, checkAuth, handleValidationErrors, TrainingController.remove);
app.patch('/admin/training/updateCatalog/:id', checkAuth, catalogVideoCreateValidation, handleValidationErrors, TrainingController.updateCatalog);
app.patch('/admin/training/updateImage/:id', checkAuth, trainingImageUpload.single('image'), TrainingController.updateImage);

//ВИДЕО
app.post('/admin/training/newVideo', checkAuth, videoCreateValidation, handleValidationErrors, TrainingController.createVideo);
app.delete(`/admin/training/removeVideo/:id`, checkAuth, handleValidationErrors, TrainingController.removeVideo);


//ИЗМЕНЕНИЕ ПАРОЛЯ ДЛЯ НОВОГО ПОЛЬЗОВАТЕЛЯ -- Сброс пароля
app.patch('/resetPassword/:token', handleValidationErrors, UserController.resetPassword)

//Запись на прием
//Покупатели (записались на услугу, попали на прием, обратились в сервис)
app.get('/appointments', AppointmentController.getAll);
app.get('/appointments/:id', AppointmentController.getOne);
app.post('/appointments', appointmentCreateValidation, handleValidationErrors, AppointmentController.create);
app.delete('/appointments/:id', checkAuth, AppointmentController.remove);
app.patch('/appointments/:id', checkAuth, appointmentCreateValidation, handleValidationErrors, AppointmentController.update);
app.get('/appointments/employer/:id', AppointmentController.getByEmployer);

//События для календаря
// app.get('/events', EventController.getAllFromAppointments);
// app.post('/events', eventCreateValidation, handleValidationErrors, EventController.create);
//     app.get('/events/employer/:id', EventController.getByEmployer);


//Сервер
app.listen(process.env.PORT || 4444, (err) => { //запустить сервер
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});