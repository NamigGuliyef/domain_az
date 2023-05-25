import { hash, genSalt, compare } from 'bcrypt'

export const hashPassword = async (password) => {
    try {
        const hashPass = await hash(password, await genSalt())
        return hashPass
    } catch (error) {
        return res.send(error.message)
    }
}

export const comparePassword = async (password, hashedPassword) => {
    return compare(password, hashedPassword)
}
