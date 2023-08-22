import mongoose from "mongoose";

const EmployerSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        profession: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        achievements: {
            type: String,
            required: true,
        },
        certificates: {
            type: Array,
            default: [],
        },
        // imageUrl: String,
    },
    {
        timestamps: true,
    },
);
export default mongoose.model('Employer', EmployerSchema);