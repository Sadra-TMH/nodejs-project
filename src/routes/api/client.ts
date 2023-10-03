import { Router } from "express";
import ClientController from "../../controller/ClientController";

const router = Router();

router.route('/').post(ClientController.create)

export default router;
