//тот кто заказывал услугу, пользовался ей, обращался в сервис.
import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
        customer: { //Имя, Фамилия, почта, телефон
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer', //relationship: свойство ссылается на модель User
            required: true,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service', //relationship: свойство ссылается на модель User
            required: true,
        },
        employer: { //пока в сотрудника на запись записываем юзера-админа. Сделать роль юзер-сотрудник.
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', //relationship: свойство ссылается на модель User
            required: true,
        },
        dateTime: { // Из формы идет формат "2023-04-24 15:00"
            type: Date,
            required: true,
        }

    },
    {
        timestamps: true,
    },
);
export default mongoose.model('Appointment', AppointmentSchema);