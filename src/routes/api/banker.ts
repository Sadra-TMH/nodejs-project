import { Router } from "express";
import BankerController from "../../controller/BankerController";

const router = Router();

router.route("/").post(BankerController.create);

export default router;
