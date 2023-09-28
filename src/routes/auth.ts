import {Router} from 'express'
import AuthController from "../controller/AuthController";
import { checkJwt } from "../middleware/checkJwt";

const router = Router()

router.post('/login', AuthController.login)

router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router