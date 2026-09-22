import express from "express";

import {
  getStudentLessonNotes,
  getTutorLessonNotes,
  saveLessonNote,
} from "../controllers/lessonNoteController.js";

import {
  authorizeRoles,
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

const studentAccountTypes = ["student", "parent", "admin"];

/* All Class Notes routes require login */
router.use(protect);

/* Tutor Class Notes routes */
router.get(
  "/tutor",
  authorizeRoles("tutor"),
  getTutorLessonNotes
);

router.put(
  "/:bookingId",
  authorizeRoles("tutor"),
  saveLessonNote
);

/* Student Class Notes routes */
router.get(
  "/student",
  authorizeRoles(...studentAccountTypes),
  getStudentLessonNotes
);

export default router;