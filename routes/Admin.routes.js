import express from 'express'
import { FetchAdminProfile, login, logout, register, UpdateAdminDetails } from '../controllers/Admin.controller.js'
import { CheckAuth } from '../middlewares/checkAuth.js'
export const AdminRouter = express.Router()

AdminRouter.post('/register',register)
AdminRouter.post('/login',login)
AdminRouter.post('/logout',logout)
AdminRouter.get('/fetchprofile',CheckAuth,FetchAdminProfile)
AdminRouter.put('/updateadmindetails',CheckAuth,UpdateAdminDetails)
