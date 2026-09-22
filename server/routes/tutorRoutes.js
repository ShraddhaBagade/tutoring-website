import express from "express";

import {
  activateTutorAccount,
  applyAsTutor,
  approveTutor,
  getMyTutorProfile,
  getPendingTutors,
  getTutorById,
  getTutors,
  rejectTutor,
  updateMyAvailability,
} from "../controllers/tutorController.js";

import {
  authorizeRoles,
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* Public tutor browsing and application routes */
router.get("/", getTutors);
router.post("/apply", applyAsTutor);
router.post("/activate-account", activateTutorAccount);

/* Tutor-only routes */
router.get(
  "/me/profile",
  protect,
  authorizeRoles("tutor"),
  getMyTutorProfile
);

router.patch(
  "/me/availability",
  protect,
  authorizeRoles("tutor"),
  updateMyAvailability
);

/* Admin-only routes */
router.get(
  "/admin/pending",
  protect,
  authorizeRoles("admin"),
  getPendingTutors
);

router.patch(
  "/admin/:tutorId/approve",
  protect,
  authorizeRoles("admin"),
  approveTutor
);

router.patch(
  "/admin/:tutorId/reject",
  protect,
  authorizeRoles("admin"),
  rejectTutor
);

/* Keep this dynamic route last */
router.get("/:tutorId", getTutorById);

export default router;