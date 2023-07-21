import mongoose from "mongoose";

const consultationRecordSchema = new mongoose.Schema(
    {
        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ConsultationTopic',
            required: true
        },
        clientName: {
            type: String,
            required: true
        },
        clientPhone: {
            type: String,
            required: true
        },
        clientEmail: {
            type: String,
            required: true
        },
        additionalInfo: {
            type: String
        }
    }, {timestamps: true}
)

export default mongoose.model('ConsultationRecord', consultationRecordSchema);