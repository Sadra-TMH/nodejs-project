import { Router } from "express";
import TransactionController from "../../controller/TransactionController";

const router = Router();

router
  .route("/")
  .get(TransactionController.getAll)
  .post(TransactionController.create);

router
  .route("/:id")
  .get(TransactionController.getOne)
  .put(TransactionController.update)
  .delete(TransactionController.delete);

export default router;
