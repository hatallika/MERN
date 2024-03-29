//Рабочие часы сотрудников DateTime.
import mongoose from "mongoose";

const WorkTimeSchema = new mongoose.Schema({

        employer: { //User - role: employer
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', //relationship: свойство ссылается на модель User
            required: true,
            unique: true,
        },

        workTime: {
            type: Array,
            default: [Date],
        }
    },
    {
        timestamps: true,
    },
);
export default mongoose.model('WorkTime', WorkTimeSchema);