import express from "express";
import { protect, isAdmin } from "../middleware/auth.middleware.js";

import {
  getAllUsers,
  deleteUser,
  addDoctors,
  updateDoctor,
  deleteDoctor,
  getAllDoctor,
  findDoctor,
  adminAssignDoctor,
  getAllConsultations,
  getConsultationByIdForAdmin,
  verifyDoctor, // <-- ADDED
  deleteConsultation, // <-- ADDED
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(protect);
router.use(isAdmin);

// --- User Routes ---
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// --- Doctor Routes ---
router.post("/doctors", addDoctors);
router.get("/doctors", getAllDoctor);
router.get("/doctors/:id", findDoctor);
router.put("/doctors/:id", updateDoctor);
router.delete("/doctors/:id", deleteDoctor);
router.put("/doctors/verify/:id", verifyDoctor); // <-- ADDED ROUTE

// --- Consultation Routes ---
router.get("/consultations", getAllConsultations);
router.get("/consultations/:id", getConsultationByIdForAdmin);
router.put("/consultations/assign/:id", adminAssignDoctor);
router.delete("/consultations/:id", deleteConsultation); // <-- ADDED ROUTE

export default router;