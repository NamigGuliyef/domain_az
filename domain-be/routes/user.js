import { Router } from "express";
import { userMiddleWare } from "../auth/authMiddleWare.js";
import { deleteUser, updateUser, myProfile, getById, sellDomain,getDomainsByUserId } from "../controllers/user.js";
const r = Router()

r.get('/search/:_id', getById) //ok
r.get('/domains', userMiddleWare, getDomainsByUserId)//ok
r.post('/sell-domain/:_id/:newUserId', userMiddleWare, sellDomain)//ok
r.get('/profile', userMiddleWare, myProfile)//ok
r.put('/update', userMiddleWare, updateUser)//ok
r.delete('/delete', userMiddleWare, deleteUser)//ok


export default r
