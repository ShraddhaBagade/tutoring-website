import express from "express";

import {
  cancelBooking,
  cancelTutorBooking,
  completeTutorBooking,
  createBooking,
  getBookedTimes,
  getCalendarAvailability,
  getMyBookings,
  getTutorBookings,
} from "../controllers/bookingController.js";

import {
  authorizeRoles,
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

const studentAccountTypes = ["student", "parent", "admin"];

/* All booking routes require login */
router.use(protect);

/* Student booking routes */
router.post(
  "/",
  authorizeRoles(...studentAccountTypes),
  createBooking
);

router.get(
  "/my-bookings",
  authorizeRoles(...studentAccountTypes),
  getMyBookings
);

router.patch(
  "/:bookingId/cancel",
  authorizeRoles(...studentAccountTypes),
  cancelBooking
);

/* Tutor booking routes */
router.get(
  "/tutor-bookings",
  authorizeRoles("tutor"),
  getTutorBookings
);

router.patch(
  "/tutor-bookings/:bookingId/complete",
  authorizeRoles("tutor"),
  completeTutorBooking
);

router.patch(
  "/tutor-bookings/:bookingId/cancel",
  authorizeRoles("tutor"),
  cancelTutorBooking
);

/* Student availability checks while booking */
router.get(
  "/availability",
  authorizeRoles(...studentAccountTypes),
  getBookedTimes
);

router.get(
  "/calendar-availability",
  authorizeRoles(...studentAccountTypes),
  getCalendarAvailability
);

export default router;