import { Router, Request, Response } from "express";
import register from "./register"
import auth from "./auth"
import user from "./user"

const router = Router()

router.use('/register', register)
router.use('/auth', auth)
router.use('/user', user)

export default router

