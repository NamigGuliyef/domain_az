import Joi from "joi"
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { userModel } from "../models/user.js"
import { comparePassword, hashPassword } from "../help/authHelp.js"
import { verifyModel } from "../models/verify.js"


export const sign_up = async (req, res) => {
    try {
        const userSchema = Joi.object({
            name: Joi.string().pattern(new RegExp("^[a-zA-ZəöğıüçşƏÖĞIÜÇŞ]{3,30}$")).required(),
            surname: Joi.string().pattern(new RegExp("^[a-zA-ZəöğıüçşƏÖĞIÜÇŞ]{3,30}$")).required(),
            email: Joi.string().email({ tlds: { allow: ["com", "net", "ru", "az"] } }).required(),
            password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@!#$%&.]{8,30}$")).required(),
        })
        const { error, value } = userSchema.validate(req.body)
        if (error) {
            return res.status(400).send({ success: false, error: error.message })
        }
        const hashPass = await hashPassword(value.password)
        const newUser = await userModel.create({ ...value, password: hashPass })
        return res.status(201).send({ success: true, message: "User has been created!", newUser })
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Error in sign-in', error: error.message })
    }
}


export const sign_in = async (req, res) => {
    try {
        const userSchema = Joi.object({
            email: Joi.string().email({ tlds: { allow: ["com", "net", "ru", "az"] } }).required(),
            password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@!#$%&.]{8,30}$")).required(),
        })
        const { error, value: { email, password } } = userSchema.validate(req.body)
        if (error) {
            return res.status(400).send({ success: false, error: error.message })
        }
        const userExist = await userModel.findOne({ email })
        if (!userExist) {
            return res.status(401).send({ success: false, message: "Email is wrong" })
        }
        const passRight = await comparePassword(password, userExist.password,)
        if (!passRight) {
            return res.status(401).send({ success: false, message: "Password is wrong" })
        }
        const token = jwt.sign({ _id: userExist._id, role: userExist.role, email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        return res.status(200).send({ success: true, token })
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Error in sign-up', error: error.message })
    }
}


export const forgetPassword = async (req, res) => {
    try {
        const userSchema = Joi.object({
            email: Joi.string().email({ tlds: { allow: ["com", "net", "ru", "az"] } }).required(),
        })
        const { error, value: { email } } = userSchema.validate(req.body)
        if (error) {
            return res.status(400).send({ success: false, error: error.message })
        }
        const userExist = await userModel.findOne({ email })
        if (!userExist) {
            return res.status(401).send({ success: false, message: "Email is wrong" })
        }
        const verify_code = Math.floor(Math.random() * 1000000)
        await verifyModel.create({ verify_code, email: userExist.email })
        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: "quliyevnamiq8@gmail.com",
                pass: "coowzbklvoagyfzk"
            }
        })
        let details = {
            from: "quliyevnamiq8@gmail.com",
            to: `${email}`,
            subject: "User verify code",
            html: `Verify code : ${verify_code} `
        }
        mailTransporter.sendMail(details, (err) => {
            if (err) {
                return res.status(400).send({ success: false, error: err.message });
            }
            return res.status(200).send({ success: true, message: "The verification code has been sent to the email address" })
        })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Error in forget password", error: error.message })
    }
}


export const verify = async (req, res) => {
    try {
        const { verify_code } = req.body
        const check_confirmation = await verifyModel.findOne({ verify_code })
        if (!check_confirmation) {
            return res.status(401).send({ success: false, message: "Verify code is wrong!" })
        }
        const token = jwt.sign({ email: check_confirmation.email }, process.env.JWT_SECRET_VERIFY)
        return res.status(200).send({ success: true, message: "Verify code is correct", token: `${token}` })

    } catch (error) {
        return res.status(500).send({ success: false, message: "Error in verify code", error: error.message })
    }
}


export const recovery = async (req, res) => {
    try {
        const { token } = req.params
        if (!token) {
            return res.status(400).send({ success: false, message: "Token is invalid" })
        }
        jwt.verify(token, process.env.JWT_SECRET_VERIFY, async (err, data) => {
            if (err) {
                return res.status(401).send({ success: false, message: "Token is wrong!" })
            }
            const userSchema = Joi.object({
                new_password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@!#$%&.]{8,30}$")).required(),
                repeat_password: Joi.string().equal(Joi.ref('new_password')).required()
            })

            const { error, value } = userSchema.validate(req.body)
            if (error) {
                return res.status(401).send({ success: false, error: error.message })
            }
            const hashPass = await hashPassword(value.new_password)
            const updatePassword = await userModel.findOneAndUpdate({ email: data.email }, { $set: { password: hashPass } }, { new: true })
            return res.status(200).send({ success: true, message: "Your password is updated", updatePassword })
        })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Error in recovery", error: error.message })
    }
}


