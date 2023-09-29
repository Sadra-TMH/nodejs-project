import {Router} from 'express'
import AuthController from "../controller/AuthController";
import { checkJwt } from "../middleware/checkJwt";

const router = Router()

router.post('/login', AuthController.login)

router.get('/logout', AuthController.logout)

router.get('/refresh', AuthController.refreshToken)

router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router