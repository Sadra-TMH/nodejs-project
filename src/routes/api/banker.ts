import { Router } from "express";
import BankerController from "../../controller/BankerController";

const router = Router();

router.route("/").post(BankerController.create);
router.route("/:id").put(BankerController.update);

export default router;
