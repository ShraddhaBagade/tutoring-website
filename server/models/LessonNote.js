import mongoose from "mongoose";

const lessonNoteSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },

    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lessonSummary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    progressUpdate: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    homeworkReminder: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    classVideoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    classNotesUrl: {
      type: String,
      default: "",
      trim: true,
    },

    privateTutorNotes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

const LessonNote = mongoose.model("LessonNote", lessonNoteSchema);

export default LessonNote;