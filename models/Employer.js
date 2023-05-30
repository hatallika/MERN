//Сотрудник
import mongoose from "mongoose";

const EmployerSchema = new mongoose.Schema({

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', //relationship: свойство ссылается на модель User
            required: true,
        },
        profession: {
            type: String,
            required: true, // false?//достаточно ли email?
        },
        imageUrl: String,

        description: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        certificates: {
            type: Array,
            default: [], //опционально если не укажутся теги, будет пустой массив.
        },

    },
    {
        timestamps: true,
    },
);
export default mongoose.model('Employer', EmployerSchema);