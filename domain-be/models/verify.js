import { model, Schema } from "mongoose";
const verifySchema = new Schema({
    verify_code: { type: Number, required: true },
    email: { type: String },
    createdAt: {
        type: Date,
        expires: 300
    }
}, { versionKey: false, timestamps: true })

export const verifyModel = model('verifyCode', verifySchema)
