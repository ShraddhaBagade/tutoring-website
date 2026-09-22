import Tutor from "../models/Tutor.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const getTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({ active: true, status: "active" }).sort({
      tutorId: 1,
    });

    res.status(200).json({
      tutors,
    });
  } catch {
    res.status(500).json({
      message: "Unable to fetch tutors.",
    });
  }
};

export const getTutorById = async (req, res) => {
  try {
    const tutorId = Number(req.params.tutorId);

    if (!Number.isInteger(tutorId)) {
      return res.status(400).json({
        message: "Invalid tutor ID.",
      });
    }

    const tutor = await Tutor.findOne({
      tutorId,
      active: true,
      status: "active",
    });

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found.",
      });
    }

    res.status(200).json({
      tutor,
    });
  } catch {
    res.status(500).json({
      message: "Unable to fetch tutor details.",
    });
  }
};

export const applyAsTutor = async (req, res) => {
  try {
    const { name, email, subject, experience, bio, image } = req.body;

    if (!name || !email || !subject || !experience || !image) {
      return res.status(400).json({
        message:
          "Name, email, subject, experience, and profile image are required.",
      });
    }

    const existingTutor = await Tutor.findOne({
      email: email.toLowerCase(),
    });

    if (existingTutor) {
      return res.status(409).json({
        message: "A tutor application already exists for this email address.",
      });
    }
    const latestTutor = await Tutor.findOne().sort({
      tutorId: -1,
    });

    const nextTutorId = latestTutor ? latestTutor.tutorId + 1 : 1;

    const tutor = await Tutor.create({
      tutorId: nextTutorId,
      name,
      email: email.toLowerCase(),
      subject,
      experience,
      bio: bio || "",
      image,
      status: "pending",
      active: true,
    });

    res.status(201).json({
      message: "Tutor application submitted. It is awaiting admin approval.",
      tutor,
    });
  } catch {
    res.status(500).json({
      message: "Unable to submit tutor application.",
    });
  }
};

export const getPendingTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({
      status: "pending",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      tutors,
    });
  } catch {
    res.status(500).json({
      message: "Unable to fetch pending tutor applications.",
    });
  }
};

export const approveTutor = async (req, res) => {
  try {
    const tutorId = Number(req.params.tutorId);

    const tutor = await Tutor.findOneAndUpdate(
      {
        tutorId,
        status: "pending",
      },
      {
        status: "active",
        active: true,
      },
      {
        new: true,
      },
    );

    if (!tutor) {
      return res.status(404).json({
        message: "Pending tutor application not found.",
      });
    }

    res.status(200).json({
      message: "Tutor application approved successfully.",
      tutor,
    });
  } catch {
    res.status(500).json({
      message: "Unable to approve tutor application.",
    });
  }
};

export const rejectTutor = async (req, res) => {
  try {
    const tutorId = Number(req.params.tutorId);

    const tutor = await Tutor.findOneAndUpdate(
      {
        tutorId,
        status: "pending",
      },
      {
        status: "rejected",
        active: false,
      },
      {
        new: true,
      },
    );

    if (!tutor) {
      return res.status(404).json({
        message: "Pending tutor application not found.",
      });
    }

    res.status(200).json({
      message: "Tutor application rejected.",
      tutor,
    });
  } catch {
    res.status(500).json({
      message: "Unable to reject tutor application.",
    });
  }
};
export const activateTutorAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const tutor = await Tutor.findOne({
      email: normalizedEmail,
      status: "active",
    });

    if (!tutor) {
      return res.status(403).json({
        message:
          "No approved tutor application was found for this email address.",
      });
    }

    if (tutor.user) {
      return res.status(409).json({
        message: "A tutor account has already been created for this email.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account already exists for this email address.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName: tutor.name,
      email: normalizedEmail,
      password: hashedPassword,
      accountType: "tutor",
    });

    tutor.user = user._id;
    await tutor.save();

    res.status(201).json({
      message: "Tutor account created successfully. You can now log in.",
    });
  } catch {
    res.status(500).json({
      message: "Unable to activate tutor account.",
    });
  }
};
export const getMyTutorProfile = async (req, res) => {
  try {
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

    res.status(200).json({
      tutor,
    });
  } catch {
    res.status(500).json({
      message: "Unable to load tutor profile.",
    });
  }
};

export const updateMyAvailability = async (req, res) => {
  try {
    const { availableDays, times } = req.body;

    if (!Array.isArray(availableDays) || !Array.isArray(times)) {
      return res.status(400).json({
        message: "Available days and times must be provided as lists.",
      });
    }

    const allowedDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ];

    const allowedTimes = [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
    ];

    const hasInvalidDay = availableDays.some(
      (day) => !allowedDays.includes(day),
    );

    const hasInvalidTime = times.some((time) => !allowedTimes.includes(time));

    if (hasInvalidDay || hasInvalidTime) {
      return res.status(400).json({
        message: "One or more selected days or times are invalid.",
      });
    }

    const tutor = await Tutor.findOneAndUpdate(
      {
        user: req.user._id,
        status: "active",
        active: true,
      },
      {
        availableDays,
        times,
      },
      {
        new: true,
      },
    );

    if (!tutor) {
      return res.status(404).json({
        message: "Active tutor profile not found.",
      });
    }

    res.status(200).json({
      message: "Availability updated successfully.",
      tutor,
    });
  } catch {
    res.status(500).json({
      message: "Unable to update availability.",
    });
  }
};
