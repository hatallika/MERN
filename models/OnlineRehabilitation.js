import mongoose from "mongoose";

const OnlineRehabilitationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        treatment: {
            type: Array,
            default: []
        },

        //связываем с конкретным сотрудником
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('OnlineRehabilitation', OnlineRehabilitationSchema)