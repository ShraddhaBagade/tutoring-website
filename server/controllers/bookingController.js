import Booking from "../models/Booking.js";
import Tutor from "../models/Tutor.js";

function convertTimeToMinutes(time) {
  const [clockTime, period] = time.split(" ");
  const [hourValue, minuteValue] = clockTime.split(":").map(Number);

  let hour = hourValue;

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return hour * 60 + minuteValue;
}

const BOOKING_TIME_ZONE = "America/New_York";

function getCurrentBookingTime() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BOOKING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    today: `${values.year}-${values.month}-${values.day}`,
    currentMinutes: Number(values.hour) * 60 + Number(values.minute),
  };
}

function hasSessionExpired(sessionDate, sessionTime) {
  const { today, currentMinutes } = getCurrentBookingTime();

  if (sessionDate < today) {
    return true;
  }

  if (sessionDate > today) {
    return false;
  }

  const sessionEndMinutes = convertTimeToMinutes(sessionTime) + 60;

  return sessionEndMinutes <= currentMinutes;
}

async function deleteExpiredUpcomingBookings(filter = {}) {
  const upcomingBookings = await Booking.find({
    ...filter,
    status: "upcoming",
  }).select("_id sessionDate sessionTime");

  const expiredBookingIds = upcomingBookings
    .filter((booking) => {
      return hasSessionExpired(booking.sessionDate, booking.sessionTime);
    })
    .map((booking) => booking._id);

  if (expiredBookingIds.length > 0) {
    await Booking.deleteMany({
      _id: { $in: expiredBookingIds },
      status: "upcoming",
    });
  }
}

// Create a new booking
export async function createBooking(req, res) {
  try {
    const { tutorId, sessionType, sessionDate, sessionTime } = req.body;

    const numericTutorId = Number(tutorId);

    if (
      !Number.isInteger(numericTutorId) ||
      !sessionType ||
      !sessionDate ||
      !sessionTime
    ) {
      return res.status(400).json({
        message: "Please provide valid booking details.",
      });
    }

    if (!["Online", "In Person"].includes(sessionType)) {
      return res.status(400).json({
        message: "Please select a valid session format.",
      });
    }

    const tutor = await Tutor.findOne({
      tutorId: numericTutorId,
      status: "active",
      active: true,
    });

    if (!tutor) {
      return res.status(404).json({
        message: "This tutor is not currently available for booking.",
      });
    }

    const selectedDate = new Date(`${sessionDate}T00:00:00Z`);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Please select a valid session date.",
      });
    }

    const { today, currentMinutes } = getCurrentBookingTime();

    if (sessionDate < today) {
      return res.status(400).json({
        message: "You cannot book a session in the past.",
      });
    }

    const weekdayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const selectedWeekday = weekdayNames[selectedDate.getUTCDay()];

    if (!tutor.availableDays.includes(selectedWeekday)) {
      return res.status(400).json({
        message: `${tutor.name} is not available on ${selectedWeekday}.`,
      });
    }

    if (!tutor.times.includes(sessionTime)) {
      return res.status(400).json({
        message: `${tutor.name} is not available at this time.`,
      });
    }

    const sessionMinutes = convertTimeToMinutes(sessionTime);

    if (sessionMinutes < 540 || sessionMinutes >= 1080) {
      return res.status(400).json({
        message: "Please select a valid one-hour session time.",
      });
    }

    if (sessionDate === today && sessionMinutes <= currentMinutes) {
      return res.status(400).json({
        message:
          "This session time has already passed. Please choose another available time.",
      });
    }

    const existingBooking = await Booking.findOne({
      tutorId: tutor.tutorId,
      sessionDate,
      sessionTime,
      status: "upcoming",
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This session time has already been booked.",
      });
    }

    const booking = await Booking.create({
      student: req.user._id,
      tutorId: tutor.tutorId,
      tutorName: tutor.name,
      tutorImage: tutor.image,
      subject: tutor.subject,
      sessionType,
      sessionDate,
      sessionTime,
    });

    res.status(201).json({
      message: "Session booked successfully.",
      booking,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This session time has already been booked.",
      });
    }

    console.error("Create booking error:", error);

    res.status(500).json({
      message: "Unable to create the booking.",
    });
  }
}

// Get bookings belonging to the logged-in student
export async function getMyBookings(req, res) {
  try {
    await deleteExpiredUpcomingBookings({
      student: req.user._id,
    });
    const bookings = await Booking.find({
      student: req.user._id,
    }).sort({
      sessionDate: 1,
      sessionTime: 1,
    });

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    res.status(500).json({
      message: "Unable to retrieve your bookings.",
    });
  }
}

// Get fully/partly booked dates for a tutor
export async function getCalendarAvailability(req, res) {
  try {
    const { tutorId, startDate } = req.query;

    if (!tutorId || !startDate) {
      return res.status(400).json({
        message: "Tutor and start date are required.",
      });
    }

    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(start);

    end.setUTCDate(end.getUTCDate() + 45);

    const endDate = end.toISOString().split("T")[0];

    const bookings = await Booking.find({
      tutorId: Number(tutorId),
      sessionDate: {
        $gte: startDate,
        $lte: endDate,
      },
      status: "upcoming",
    }).select("sessionDate sessionTime -_id");

    const bookedByDate = {};

    bookings.forEach((booking) => {
      if (!bookedByDate[booking.sessionDate]) {
        bookedByDate[booking.sessionDate] = [];
      }

      bookedByDate[booking.sessionDate].push(booking.sessionTime);
    });

    res.status(200).json({
      bookedByDate,
    });
  } catch (error) {
    console.error("Calendar availability error:", error);

    res.status(500).json({
      message: "Unable to retrieve calendar availability.",
    });
  }
}

// Get booked time slots for one tutor and date
export async function getBookedTimes(req, res) {
  try {
    const { tutorId, date } = req.query;

    if (!tutorId || !date) {
      return res.status(400).json({
        message: "Tutor and date are required.",
      });
    }

    const bookings = await Booking.find({
      tutorId: Number(tutorId),
      sessionDate: date,
      status: "upcoming",
    }).select("sessionTime -_id");

    const bookedTimes = bookings.map((booking) => booking.sessionTime);

    res.status(200).json({
      bookedTimes,
    });
  } catch (error) {
    console.error("Get booked times error:", error);

    res.status(500).json({
      message: "Unable to retrieve available times.",
    });
  }
}

// Cancel one of the logged-in student's bookings
export async function cancelBooking(req, res) {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      student: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "This booking has already been cancelled.",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        message: "A completed session cannot be cancelled.",
      });
    }

    booking.status = "cancelled";
    booking.cancelledBy = "student";
    booking.cancellationReason = "";
    await booking.save();

    res.status(200).json({
      message: "Session cancelled successfully.",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    res.status(500).json({
      message: "Unable to cancel the booking.",
    });
  }
}

// Get bookings for the logged-in tutor
export async function getTutorBookings(req, res) {
  try {
    await deleteExpiredUpcomingBookings();
    const tutor = await Tutor.findOne({
      user: req.user._id,
      status: "active",
      active: true,
    });

    if (!tutor) {
      return res.status(404).json({
        message: "Active tutor profile not found.",
      });
    }

    const bookings = await Booking.find({
      tutorId: tutor.tutorId,
    })
      .populate("student", "fullName email")
      .sort({
        sessionDate: 1,
        sessionTime: 1,
      });

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.error("Get tutor bookings error:", error);

    res.status(500).json({
      message: "Unable to load tutor sessions.",
    });
  }
}

// Mark a tutor's own upcoming session as completed
export async function completeTutorBooking(req, res) {
  try {
    const tutor = await Tutor.findOne({
      user: req.user._id,
      status: "active",
      active: true,
    });

    if (!tutor) {
      return res.status(403).json({
        message: "Only an active tutor can complete a session.",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      tutorId: tutor.tutorId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Session not found.",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        message: "This session has already been marked as completed.",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "A cancelled session cannot be marked as completed.",
      });
    }

    booking.status = "completed";
    await booking.save();

    res.status(200).json({
      message: "Session marked as completed.",
      booking,
    });
  } catch (error) {
    console.error("Complete tutor booking error:", error);

    res.status(500).json({
      message: "Unable to mark the session as completed.",
    });
  }
}

// Cancel a tutor's own upcoming session
export async function cancelTutorBooking(req, res) {
  try {
    const { cancellationReason } = req.body;

    const tutor = await Tutor.findOne({
      user: req.user._id,
      status: "active",
      active: true,
    });

    if (!tutor) {
      return res.status(403).json({
        message: "Only an active tutor can cancel a session.",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      tutorId: tutor.tutorId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Session not found.",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "This session has already been cancelled.",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        message: "A completed session cannot be cancelled.",
      });
    }

    booking.status = "cancelled";
    booking.cancelledBy = "tutor";
    booking.cancellationReason = cancellationReason?.trim() || "";
    await booking.save();

    res.status(200).json({
      message: "Session cancelled successfully.",
      booking,
    });
  } catch (error) {
    console.error("Tutor cancel booking error:", error);

    res.status(500).json({
      message: "Unable to cancel the session.",
    });
  }
}
