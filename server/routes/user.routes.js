import express from "express";
import {
  createConsultation,
  getMyConsultations,
  getConsultationById,
} from "../controllers/user.consultation.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createConsultation);

router.get("/my", getMyConsultations);

router.get("/:id", getConsultationById);

export default router;
