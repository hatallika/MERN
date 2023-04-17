import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },

        // URL видео на YouTube или другом видеохостинге
        videoUrl: {
            type: String
        },

        //уникальный идентификатор категории, к которой относится видео
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'VideoCatalog',
            required: true
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('Video', VideoSchema)