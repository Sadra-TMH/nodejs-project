import { Router } from "express";
import TransactionController from "../../controller/TransactionController";

const router = Router();

router.route("/").post(TransactionController.create);

export default router;
