import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        unique: false,
        required: true,
        // убираем уникальность, потому что один работник может иметь несколько интервалов работы
    },
    daysOfWeek: {
        type: [Number], // массив номеров дней
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    startRecur: {
        type: Date
    },
    endRecur: {
        type: Date
    },
    color: {
        type: String
    },
    groupId: {
        type: String
    }
}, {
    timestamps: true,
});
export default mongoose.model('Schedule', ScheduleSchema);