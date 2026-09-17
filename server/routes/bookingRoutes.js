import express from "express";

import {
  createBooking,
  getMyBookings,
  getBookedTimes,
  getCalendarAvailability,
  cancelBooking,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All booking routes require authentication
router.use(protect);

// Create a booking
router.post("/", createBooking);

// Get the logged-in student's bookings
router.get("/my-bookings", getMyBookings);

router.get("/availability", getBookedTimes);

router.get("/calendar-availability", getCalendarAvailability);
// Cancel a booking
router.patch("/:bookingId/cancel", cancelBooking);

export default router;
