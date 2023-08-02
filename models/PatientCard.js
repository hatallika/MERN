import mongoose from "mongoose";

const patientCardSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        catalogVideoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'VideoCatalog',
            default: null
        },
        employerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employer',
            default: null
        },
        recommendations: {
            type: String,
            default: ''
        }
    }
)

export default mongoose.model('PatientCard', patientCardSchema);