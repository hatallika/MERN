import mongoose from "mongoose";

const VideoCatalogSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        //массив идентификаторов видео, относящихся к этой категории
        videos:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Video',
                }
            ],

        imageUrl: String,
    },
    {
        timestamps: true
    }
)

export default mongoose.model('VideoCatalog', VideoCatalogSchema);