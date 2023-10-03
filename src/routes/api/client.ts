import { Router } from "express";
import ClientController from "../../controller/ClientController";

const router = Router();

router.route("/").post(ClientController.create);

router.route("/:clientId").delete(ClientController.delete);

export default router;
