import express from "express";

import {
  createAssignment,
  getStudentAssignments,
  getTutorAssignments,
  reviewAssignment,
  submitAssignment,
} from "../controllers/assignmentController.js";

import {
  authorizeRoles,
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

const studentAccountTypes = ["student", "parent", "admin"];

/* All assignment routes require login */
router.use(protect);

/* Tutor assignment routes */
router.post("/", authorizeRoles("tutor"), createAssignment);

router.get(
  "/tutor",
  authorizeRoles("tutor"),
  getTutorAssignments
);

router.patch(
  "/:assignmentId/review",
  authorizeRoles("tutor"),
  reviewAssignment
);

/* Student assignment routes */
router.get(
  "/student",
  authorizeRoles(...studentAccountTypes),
  getStudentAssignments
);

router.patch(
  "/:assignmentId/submit",
  authorizeRoles(...studentAccountTypes),
  submitAssignment
);

export default router;