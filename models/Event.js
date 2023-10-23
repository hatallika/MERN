import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
        start: {
            type: Date,
            required: true,
        },
        end: {
            type: Date,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);
export default mongoose.model('Event', EventSchema);