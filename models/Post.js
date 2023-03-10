import mongoose from "mongoose";
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        default: [], //опционально если не укажутся теги, будет пустой массив.
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //relationship: свойство ссылается на модель User
        required: true,
    },
    imageUrl: String,
},
{
    timestamps: true,
},
    );
export default  mongoose.model('Post', PostSchema);