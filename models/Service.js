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
        recommendations: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            default: "",
        }
    }, {
        timestamps: true,
    });

export default mongoose.model('Service', ServiceSchema);