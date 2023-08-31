//тот кто заказывал услугу, пользовался ей, обращался в сервис.
import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({

        firstName: {
            type: String,
            required: true,
        },
        secondName: {
            type: String,
            required: true,
        },
        patronymic: String, // фамилия, если понадобится

        // user: { //если авторизован, кто создал встречу User auth
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User', //relationship: свойство ссылается на модель User
        //     required: false,
        // },
        phone: {
            type: String,
            required: true, // false?//достаточно ли email?
        },
        email: {
            type: String,
            required: true,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service', //relationship: свойство ссылается на модель Service
            required: false,
        },
        employer: { //User - role: employer
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', //relationship: свойство ссылается на модель User
            required: false,
        },
        onlineRehabilitation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OnlineRehabilitation', //relationship: свойство ссылается на модель OnlineRehabilitation
            required: false,
        },
        customer: { //User - role: customer
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', //relationship: свойство ссылается на модель User
            required: false,
        },
        text: 'String', //TODO валидация
        // dateTime: { // Из формы идет формат "2023-04-24 15:00"
        //     type: Date,
        //     required: false,
        // },
        status: {
            type: String,
            enum: ['Ждет ответа', 'Назначен прием', 'Прием состоялся', 'Прием не состоялся'],
            default: 'Открыто',
        },
        //Название источника обращения, указанное в форме (Откуда форма: Специалисты, Услуги, Онлайн-реабилитация, ...)
        source_name: 'String'
    },
    {
        timestamps: true,
    },
);
export default mongoose.model('Appointment', AppointmentSchema);