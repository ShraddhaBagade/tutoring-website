import Booking from "../models/Booking.js";
import LessonNote from "../models/LessonNote.js";
import Tutor from "../models/Tutor.js";

// Tutor creates or updates notes for one completed session
export async function saveLessonNote(req, res) {
  try {
    const {
      lessonSummary,
      progressUpdate,
      homeworkReminder,
      classVideoUrl,
      classNotesUrl,
      privateTutorNotes,
    } = req.body;

    if (!lessonSummary?.trim()) {
      return res.status(400).json({
        message: "Lesson summary is required.",
      });
    }

    const tutor = await Tutor.findOne({
      user: req.user._id,
      status: "active",
      active: true,
    });

    if (!tutor) {
      return res.status(403).json({
        message: "Only an active tutor can save lesson notes.",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      tutorId: tutor.tutorId,
      status: "completed",
    });

    if (!booking) {
      return res.status(404).json({
        message:
          "Completed session not found. Mark the session completed before adding notes.",
      });
    }

    const lessonNote = await LessonNote.findOneAndUpdate(
      {
        booking: booking._id,
      },
      {
        $set: {
          tutor: req.user._id,
          student: booking.student,
          lessonSummary: lessonSummary.trim(),
          progressUpdate: progressUpdate?.trim() || "",
          homeworkReminder: homeworkReminder?.trim() || "",
          privateTutorNotes: privateTutorNotes?.trim() || "",
          classVideoUrl: classVideoUrl?.trim() || "",
          classNotesUrl: classNotesUrl?.trim() || "",
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json({
      message: "Lesson notes saved successfully.",
      lessonNote,
    });
  } catch (error) {
    console.error("Save lesson note error:", error);

    res.status(500).json({
      message: "Unable to save lesson notes.",
    });
  }
}

// Tutor sees notes for their own completed sessions
export async function getTutorLessonNotes(req, res) {
  try {
    const notes = await LessonNote.find({
      tutor: req.user._id,
    })
      .populate("student", "fullName email")
      .populate("booking", "subject sessionDate sessionTime")
      .sort({
        updatedAt: -1,
      });

    res.status(200).json({
      notes,
    });
  } catch (error) {
    console.error("Get tutor lesson notes error:", error);

    res.status(500).json({
      message: "Unable to load lesson notes.",
    });
  }
}

// Student sees only their shared lesson notes
export async function getStudentLessonNotes(req, res) {
  try {
    const notes = await LessonNote.find({
      student: req.user._id,
    })
      .select("-privateTutorNotes")
      .populate("tutor", "fullName")
      .populate("booking", "subject sessionDate sessionTime")
      .sort({
        updatedAt: -1,
      });

    res.status(200).json({
      notes,
    });
  } catch (error) {
    console.error("Get student lesson notes error:", error);

    res.status(500).json({
      message: "Unable to load lesson notes.",
    });
  }
}
