import { Router } from "express";
import ClientController from "../../controller/ClientController";

const router = Router();

router.route("/").post(ClientController.create).get(ClientController.getAll);

router
  .route("/:id")
  .get(ClientController.getOne)
  .put(ClientController.update)
  .delete(ClientController.delete);

export default router;
