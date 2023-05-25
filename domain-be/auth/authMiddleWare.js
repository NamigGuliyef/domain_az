import jwt from "jsonwebtoken"

export const userMiddleWare = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(400).send({ success: false, message: "Token is invalid" })
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(401).send({ succes: false, message: "Token is wrong", error: err.message })
            }
            if (user.role !== 'user') {
                return res.status(403).send({ success: false, message: "You are not a user" })
            }
            req.user = user
            next()
        })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Error in authorization", error: error.message })
    }
}


export const AdminMiddleWare = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(404).send({ success: false, message: "Token is invalid" })
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
            if (err) {
                return res.status(401).send({ succes: false, message: "Token is wrong", error: err.message })
            }
            if (admin.role !== "admin") {
                return res.status(403).send({ success: false, message: "You are not a admin" })
            }
            req.admin = admin
            next()
        })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Error in authorization", error: error.message })
    }
}

