import mongoose from "mongoose";

const ConsultationTopicSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        }
    }
)

export default  mongoose.model('ConsultationTopic', ConsultationTopicSchema);