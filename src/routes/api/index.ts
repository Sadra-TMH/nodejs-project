import { Router, Request, Response } from "express";
import client from './clients'

const router = Router()

router.use('/client', client)

export default router

