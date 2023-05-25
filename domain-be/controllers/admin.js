import Joi from "joi"
import { domainModel } from "../models/domain.js"
import { userModel } from "../models/user.js"


export const getAllUser = async (req, res) => {
    try {
        const allUser = await userModel.find().select("-password -role")
        return res.status(200).send({ success: true, message: "All users", allUser })

    } catch (error) {
        return res.status(500).send({ success: false, message: "Error in all users", error: error.message })
    }
}

export const createDomain = async (req, res) => {
    try {
        const domainSchema = Joi.object({
            name: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
            topLevel: Joi.string().pattern(new RegExp("^[a-z]{2,30}$")),
            owner: Joi.string(),
            price: Joi.number().integer(),
            description: Joi.string().pattern(new RegExp("^[a-zA-Z0-9., əöğıüçşƏÖĞIÜÇŞ]{10,100}$")),
        })
        const { error, value } = domainSchema.validate(req.body)
        if (error) {
            return res.status(400).send({ success: false, error: error.message })
        }
        const domainName = await domainModel.findOne({ name: value.name })
        if (domainName) {
            return res.send({ success: false, message: "The domain name is already available" })
        }
        const domain = await domainModel.create(value)
        return res.status(200).send({ success: true, message: "New domain created successfully", domain })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Error in new create domain", error: error.message })
    }
}

export const updateDomain = async (req, res) => {
    try {
        const domainSchema = Joi.object({
            name: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
            topLevel: Joi.string().pattern(new RegExp("^[a-z]{2,30}$")),
            owner: Joi.string().required(),
            price: Joi.number().integer(),
            description: Joi.string().pattern(new RegExp("^[a-zA-Z0-9., əöğıüçşƏÖĞIÜÇŞ]{10,100}$")),
        })
        const { error, value } = domainSchema.validate(req.body)
        if (error) {
            return res.status(400).send({ success: false, error: error.message })
        }
        const { _id } = req.params
        const domain = await domainModel.findOneAndUpdate({ _id }, { $set: value }, { new: true })
        return res.status(200).send({ success: true, message: "Domain updated successfully", domain })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Error updating the domain", error: error.message })
    }
}


export const deleteDomain = async (req, res) => {
    try {
        const { _id } = req.params
        const domain = await domainModel.findOneAndDelete({ _id })
        return res.status(200).send({ success: true, message: "Domain deleted successfully" })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Error deleting domain", error: error.message })
    }
}

