import express from "express";
import { getPublicStatuses } from "../controllers/statusController.js";

const router = express.Router();

router.get("/", getPublicStatuses);

export default router;
