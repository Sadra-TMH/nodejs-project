import {Router} from 'express'
import RegisterController from "../controller/RegisterController";
// import { checkJwt } from "../middlewares/checkJwt";

const router = Router()

router.post('/', RegisterController.register)

export default router