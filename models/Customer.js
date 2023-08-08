import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        fullName: { // ДУБЛИРОВАНИЕ В USER ?? УБРАТЬ ?
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    },
);
export default mongoose.model('Customer', CustomerSchema);