import { Router, Request, Response } from "express";
import client from "./client";
import banker from "./banker";
import transaction from "./transaction";

const router = Router();

router.use("/client", client);
router.use("/banker", banker);
router.use("/transaction", transaction);

export default router;
