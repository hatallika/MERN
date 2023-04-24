//тот кто заказывал услугу, пользовался ей, обращался в сервис.
import mongoose from "mongoose";
const CustomerSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
    },
    secondName: {
        type: String,
        required: true,
    },
    patronymic: String, // фамилия, если понадобится

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //relationship: свойство ссылается на модель User
        required: false,
    },
    phone: {
        type: String,
        required: true, // false?//достаточно ли email?
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
},
{
    timestamps: true,
},
    );
export default  mongoose.model('Customer', CustomerSchema);