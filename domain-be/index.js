import express from 'express'
import dotenv from 'dotenv'
import { connectionDB } from './db.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import adminRouter from './routes/admin.js'
import domainRouter from './routes/domain.js'
import cors from 'cors'


connectionDB()
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

//test edildi.
app.use('/auth', authRouter)
//test edildi.
app.use('/', domainRouter)
//test edildi
app.use('/user', userRouter)
//test edildi
app.use('/admin', adminRouter)



app.listen(process.env.PORT, () => console.log(` Port ${process.env.PORT} server is up ....`))


