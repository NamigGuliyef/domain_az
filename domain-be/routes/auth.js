import { Router } from "express";
import { sign_in, sign_up, forgetPassword, verify, recovery } from "../controllers/auth.js";
const r = Router()


r.post('/sign-up', sign_up)
r.post('/sign-in', sign_in)
r.post('/forgetPassword', forgetPassword)
r.post('/verify', verify)
r.post('/recovery/:token', recovery)
    

export default r
