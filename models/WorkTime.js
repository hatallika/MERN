//Рабочие часы сотрудников DateTime.
import mongoose from "mongoose";

const WorkTimeSchema = new mongoose.Schema({

        employer: { //User - role: employer
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', //relationship: свойство ссылается на модель User
            required: true,
        },

        dateTime: { // Из формы идет формат "2023-04-24 15:00"
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);
export default mongoose.model('WorkTime', WorkTimeSchema);