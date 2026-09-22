import Assignment from "../models/Assignment.js";
import Booking from "../models/Booking.js";
import Tutor from "../models/Tutor.js";

function getValidDate(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return null;
  }

  const date = new Date(`${dateString}T00:00:00Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().split("T")[0] !== dateString
  ) {
    return null;
  }

  return date;
}

function isValidHttpsUrl(value) {
  try {
    const url = new URL(value);

    return url.protocol === "https:";
  } catch {
    return false;
  }
}

// Tutor creates an assignment for a student they have taught or will teach
export async function createAssignment(req, res) {
  try {
    const {
      studentId,
      bookingId,
      title,
      instructions,
      dueDate,
      resourceLink,
    } = req.body;

    if (
      !studentId ||
      !title?.trim() ||
      !instructions?.trim() ||
      !dueDate
    ) {
      return res.status(400).json({
        message:
          "Student, title, instructions, and due date are required.",
      });
    }

    const selectedDueDate = getValidDate(dueDate);

    if (!selectedDueDate) {
      return res.status(400).json({
        message: "Please select a valid due date.",
      });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (selectedDueDate <= today) {
      return res.status(400).json({
        message: "The due date must be a future weekday.",
      });
    }

    const selectedDay = selectedDueDate.getUTCDay();

    if (selectedDay === 0 || selectedDay === 6) {
      return res.status(400).json({
        message: "Assignments cannot have a weekend due date.",
      });
    }

    if (resourceLink?.trim() && !isValidHttpsUrl(resourceLink.trim())) {
      return res.status(400).json({
        message:
          "Resource link must be a valid HTTPS URL beginning with https://",
      });
    }

    const tutor = await Tutor.findOne({
      user: req.user._id,
      status: "active",
      active: true,
    });

    if (!tutor) {
      return res.status(403).json({
        message: "Only an active tutor can create assignments.",
      });
    }

    const tutorStudentBooking = await Booking.findOne({
      tutorId: tutor.tutorId,
      student: studentId,
    });

    if (!tutorStudentBooking) {
      return res.status(403).json({
        message:
          "You can only create assignments for students who booked a session with you.",
      });
    }

    if (bookingId) {
      const selectedBooking = await Booking.findOne({
        _id: bookingId,
        tutorId: tutor.tutorId,
        student: studentId,
      });

      if (!selectedBooking) {
        return res.status(400).json({
          message: "The selected session does not belong to this student.",
        });
      }
    }

    const assignment = await Assignment.create({
      tutor: req.user._id,
      student: studentId,
      booking: bookingId || null,
      title: title.trim(),
      instructions: instructions.trim(),
      dueDate,
      resourceLink: resourceLink?.trim() || "",
    });

    const populatedAssignment = await Assignment.findById(
      assignment._id
    )
      .populate("student", "fullName email")
      .populate("booking", "sessionDate sessionTime subject");

    res.status(201).json({
      message: "Assignment created successfully.",
      assignment: populatedAssignment,
    });
  } catch (error) {
    console.error("Create assignment error:", error);

    res.status(500).json({
      message: "Unable to create the assignment.",
    });
  }
}

// Tutor sees assignments they created
export async function getTutorAssignments(req, res) {
  try {
    const assignments = await Assignment.find({
      tutor: req.user._id,
    })
      .populate("student", "fullName email")
      .populate("booking", "sessionDate sessionTime subject")
      .sort({
        dueDate: 1,
        createdAt: -1,
      });

    res.status(200).json({
      assignments,
    });
  } catch (error) {
    console.error("Get tutor assignments error:", error);

    res.status(500).json({
      message: "Unable to load assignments.",
    });
  }
}

// Student sees assignments assigned to them
export async function getStudentAssignments(req, res) {
  try {
    const assignments = await Assignment.find({
      student: req.user._id,
    })
      .populate("tutor", "fullName email")
      .populate("booking", "sessionDate sessionTime subject")
      .sort({
        dueDate: 1,
        createdAt: -1,
      });

    res.status(200).json({
      assignments,
    });
  } catch (error) {
    console.error("Get student assignments error:", error);

    res.status(500).json({
      message: "Unable to load your assignments.",
    });
  }
}

// Student submits written work or a link
export async function submitAssignment(req, res) {
  try {
    const { submissionText, submissionLink } = req.body;

    if (!submissionText?.trim() && !submissionLink?.trim()) {
      return res.status(400).json({
        message:
          "Add your written response or a submission link before submitting.",
      });
    }

    if (submissionLink?.trim() && !isValidHttpsUrl(submissionLink.trim())) {
      return res.status(400).json({
        message:
          "Submission link must be a valid HTTPS URL beginning with https://",
      });
    }

    const assignment = await Assignment.findOne({
      _id: req.params.assignmentId,
      student: req.user._id,
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found.",
      });
    }

    if (assignment.status === "reviewed") {
      return res.status(400).json({
        message: "This assignment has already been reviewed.",
      });
    }

    assignment.submissionText = submissionText?.trim() || "";
    assignment.submissionLink = submissionLink?.trim() || "";
    assignment.status = "submitted";
    assignment.submittedAt = new Date();

    await assignment.save();

    res.status(200).json({
      message: "Assignment submitted successfully.",
      assignment,
    });
  } catch (error) {
    console.error("Submit assignment error:", error);

    res.status(500).json({
      message: "Unable to submit the assignment.",
    });
  }
}

// Tutor reviews a submitted assignment and leaves feedback
export async function reviewAssignment(req, res) {
  try {
    const { tutorFeedback } = req.body;

    if (!tutorFeedback?.trim()) {
      return res.status(400).json({
        message: "Please provide feedback before reviewing this assignment.",
      });
    }

    const assignment = await Assignment.findOne({
      _id: req.params.assignmentId,
      tutor: req.user._id,
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found.",
      });
    }

    if (assignment.status !== "submitted") {
      return res.status(400).json({
        message: "Only a submitted assignment can be reviewed.",
      });
    }

    assignment.tutorFeedback = tutorFeedback.trim();
    assignment.status = "reviewed";
    assignment.reviewedAt = new Date();

    await assignment.save();

    res.status(200).json({
      message: "Assignment reviewed successfully.",
      assignment,
    });
  } catch (error) {
    console.error("Review assignment error:", error);

    res.status(500).json({
      message: "Unable to review the assignment.",
    });
  }
}