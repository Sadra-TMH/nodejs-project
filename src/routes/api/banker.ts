import { Router } from "express";
import BankerController from "../../controller/BankerController";

const router = Router();

router.route("/").get(BankerController.getAll).post(BankerController.create);
router
  .route("/:id")
  .get(BankerController.getOne)
  .delete(BankerController.delete)
  .put(BankerController.update);

export default router;
