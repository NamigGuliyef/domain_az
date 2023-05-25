import { Schema, model } from "mongoose";
const userSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
}, { versionKey: false, timestamps: true })

export const userModel = model('user', userSchema)
