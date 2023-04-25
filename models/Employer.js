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
    },
    {
        timestamps: true,
    },
);
export default mongoose.model('Employer', EmployerSchema);