import mongoose, { model, Schema } from "mongoose";
const domainSchema = new Schema({
    name: { type: String, required: true },
    topLevel: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
}, { versionKey: false, timestamps: true })

export const domainModel = model('domain', domainSchema)
