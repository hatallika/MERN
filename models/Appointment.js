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

        user: { //если авторизован, кто создал встречу User auth
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', //relationship: свойство ссылается на модель User
            required: false,
        },
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
            ref: 'Service', //relationship: свойство ссылается на модель User
            required: true,
        },
        employer: { //User - role: employer
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', //relationship: свойство ссылается на модель User
            required: true,
        },
        customer: { //User - role: customer
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', //relationship: свойство ссылается на модель User
            required: false,
        },
        text: 'String', //TODO валидация
        dateTime: { // Из формы идет формат "2023-04-24 15:00"
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);
export default mongoose.model('Appointment', AppointmentSchema);