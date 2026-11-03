import express from "express";
import { getIncidentHistory, getPublicStatuses } from "../controllers/statusController.js";

const router = express.Router();

router.get("/", getPublicStatuses);
router.get("/incidents", getIncidentHistory);

export default router;
