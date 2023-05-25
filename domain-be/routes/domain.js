import { Router } from "express";
import { getDomainById, getFilterDomain } from "../controllers/domain.js";

const r = Router()

r.get('/:_id', getDomainById)//ok
r.get('/domain/filter', getFilterDomain)//ok


export default r
