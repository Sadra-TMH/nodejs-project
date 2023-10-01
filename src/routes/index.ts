import { Router, Request, Response } from "express";
import register from "./register"
import auth from "./auth"
import api from "./api"

const router = Router()

router.use('/register', register)
router.use('/auth', auth)
router.use('/api', api)

export default router

