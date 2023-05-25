import { Router } from "express";
import { getAllUser, createDomain, deleteDomain, updateDomain } from "../controllers/admin.js";
import { AdminMiddleWare } from "../auth/authMiddleWare.js";
const r = Router()


r.get('/allUsers', AdminMiddleWare, getAllUser)
r.post('/create-domain', AdminMiddleWare, createDomain)
r.put('/update-domain/:_id', AdminMiddleWare, updateDomain)
r.delete('/delete-domain/:_id', AdminMiddleWare, deleteDomain)


export default r

