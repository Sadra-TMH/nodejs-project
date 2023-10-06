import { Router, Request, Response } from "express";
import register from "./register";
import auth from "./auth";
import api from "./api";
import { checkJwt } from "../middleware/checkJwt";

const router = Router();

router.use("/register", register);
router.use("/auth", auth);
router.use("/api", [checkJwt], api);

export default router;
