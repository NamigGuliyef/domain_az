import { compare, genSalt, hash } from "bcrypt";
import Joi from "joi";
import { userModel } from "../models/user.js";
import { domainModel } from "../models/domain.js";


// guest,user => user profile view
export const getById = async (req, res) => {
    try {
        const { _id } = req.params
        const user = await userModel.findOne({ _id }).select('-password -role')
        return res.status(200).send({ success: true, user })
    } catch (error) {
        return res.status(500).send({ success: false, error: error.message })
    }
}


//user
export const myProfile = async (req, res) => {
    try {
        const { _id } = req.user
        const my_profile = await userModel.findOne({ _id }).select("-password -role")
        return res.status(200).send({ success: true, message: "My profile", my_profile })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Error in profile", error: error.message })
    }
}


export const updateUser = async (req, res) => {
    try {
        const { _id } = req.user
        const userSchema = Joi.object({
            name: Joi.string().pattern(new RegExp("^[a-zA-ZəöğıüçşƏÖĞIÜÇŞ]{3,30}$")).required(),
            surname: Joi.string().pattern(new RegExp("^[a-zA-ZəöğıüçşƏÖĞIÜÇŞ]{3,30}$")).required(),
            email: Joi.string().email({ tlds: { allow: ["com", "net", "ru", "az"] } }).required(),
            old_password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@!#$%&.]{8,30}$")),
            new_password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@!#$%&.]{8,30}$"))
        })
        const { error, value } = userSchema.validate(req.body)
        if (error) {
            return res.status(400).send({ success: false, error: error.message })
        }
        if (value.old_password) {
            const userExist = await userModel.findOne({ _id })
            const oldPassRight = await compare(value.old_password, userExist.password)
            if (!oldPassRight) {
                return res.status(401).send({ success: false, message: "Password is wrong!" })
            }
            const hashPass = await hash(value.new_password, await genSalt())
            const user = await userModel.findOneAndUpdate({ _id }, { $set: { ...value, password: hashPass } }, { new: true })
            return res.status(200).send({ success: true, message: "user update password successfully", user })
        }
        const updateUser = await userModel.findOneAndUpdate({ _id }, { $set: value }, { new: true })
        return res.status(200).send({ success: true, message: "user update successfully", updateUser })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Error in update user", error: error.message })
    }
}


export const deleteUser = async (req, res) => {
    try {
        const { _id } = req.user
        const deletedUser = await userModel.findByIdAndDelete({ _id })
        return res.status(200).send({ success: true, message: "User has been deleted successfully", deletedUser })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Error in delete user", error: error.message })
    }
}


export const sellDomain = async (req, res) => {
    try {
        const { _id, newUserId } = req.params
        const sellDomain = await domainModel.findOneAndUpdate({ _id }, { $set: { owner: newUserId } }, { new: true })
        return res.status(200).send({ success: true, message: "Domain successfully received", sellDomain })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Error when purchasing domain", error: error.message })
    }
}


export const getDomainsByUserId = async (req, res) => {
    try {
        const sold_domains = await domainModel.find({ owner: req.user._id })
        return res.status(200).send({ success: true, message: "All domains of the user", sold_domains })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Error browsing user domain", error: error.message })
    }
}

