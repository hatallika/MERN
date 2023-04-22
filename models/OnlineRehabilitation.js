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

        imageUrl: String,

        //связываем с конкретным сотрудником
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('OnlineRehabilitation', OnlineRehabilitationSchema)