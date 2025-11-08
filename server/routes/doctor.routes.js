import express from "express";
import {
  getPendingConsultations,
  assignConsultation,
  getAssignedConsultations,
  resolveConsultation,
  getConsultationByIdForDoctor,
} from "../controllers/doctor.consultation.controller.js";
import { protect, isDoctor } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.use(isDoctor);

router.get("/pending", getPendingConsultations);

router.put("/assign/:id", assignConsultation);

router.get("/assigned", getAssignedConsultations);

router.put("/solve/:id", resolveConsultation);

router.get("/consultation/:id", getConsultationByIdForDoctor);

export default router;
