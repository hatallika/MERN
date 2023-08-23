import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["employer", "customer"],
            default: "customer",
        },
        avatarUrl: {
            type: String,
            default: ""
        },
        superAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        resetPasswordToken: {
            type: String,
            required: false,
        },
        resetPasswordExpires: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: true,
    },
);
export default mongoose.model('User', UserSchema);