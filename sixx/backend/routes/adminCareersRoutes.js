import express from "express";
import {
  createJob,
  deleteApplication,
  deleteJob,
  getAdminJobs,
  getApplications,
  updateApplication,
  updateJob,
} from "../controllers/careersController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);
router.get("/jobs", getAdminJobs);
router.post("/jobs", createJob);
router.put("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);
router.get("/applications", getApplications);
router.patch("/applications/:id", updateApplication);
router.delete("/applications/:id", deleteApplication);

export default router;
