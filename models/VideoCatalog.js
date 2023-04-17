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

        //массив идентификаторов видео, относящихся к этой категории
        videos:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Videos',
                    required: true
                }
            ],

        imageUrl: String,
    },
    {
        timestamps: true
    }
)

export default mongoose.model('VideoCatalog', VideoCatalogSchema);