import { Router, Request, Response } from "express";
import register from "./register"
import auth from "./auth"

const router = Router()

router.use('/register', register)
router.use('/auth', auth)

export default router

