import mongoose from "mongoose";
const ServiceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            get: v => (v/100).toFixed(2),
            set: v => v*100
        },
        tags: {
            type: Array,
            default: [], //опционально если не укажутся теги, будет пустой массив.
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
        },
        //автор поста
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', //relationship: свойство ссылается на модель User
            required: true,
        },
        employer: { // какой сотрудник исполняет эту услугу по умолчанию
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employer', //relationship: свойство ссылается на модель User
        },
        imageUrl: String,
    },
{
    timestamps: true,
    toJSON: { getters: true },
    },
);

export default  mongoose.model('Service', ServiceSchema);