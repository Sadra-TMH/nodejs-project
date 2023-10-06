import { Router } from "express";
import TransactionController from "../../controller/TransactionController";

const router = Router();

router.route("/").post(TransactionController.create);

router.route("/:id").delete(TransactionController.delete);

export default router;
