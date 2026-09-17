import Booking from "../models/Booking.js";
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
// Create a new booking
export async function createBooking(req, res) {
  try {
    const {
      tutorId,
      tutorName,
      tutorImage,
      subject,
      sessionType,
      sessionDate,
      sessionTime,
    } = req.body;

    if (
      !tutorId ||
      !tutorName ||
      !subject ||
      !sessionType ||
      !sessionDate ||
      !sessionTime
    ) {
      return res.status(400).json({
        message: "Please provide all booking details.",
      });
    }

    const today = new Date().toISOString().split("T")[0];

    if (sessionDate === today) {
      const currentTime = new Date();

      const currentMinutes =
        currentTime.getHours() * 60 + currentTime.getMinutes();

      const sessionMinutes = convertTimeToMinutes(sessionTime);

      if (sessionMinutes <= currentMinutes) {
        return res.status(400).json({
          message: "This session cannot be Booked. Please select another time.",
        });
      }
    }

    if (sessionDate < today) {
      return res.status(400).json({
        message: "This session cannot be Booked. Please select another time.",
      });
    }

    const selectedDate = new Date(`${sessionDate}T00:00:00Z`);
    const selectedDay = selectedDate.getUTCDay();

    if (selectedDay === 0 || selectedDay === 6) {
      return res.status(400).json({
        message: "Sessions are only available Monday through Friday.",
      });
    }

    const existingBooking = await Booking.findOne({
      tutorId,
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
      tutorId,
      tutorName,
      tutorImage: tutorImage || "",
      subject,
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
