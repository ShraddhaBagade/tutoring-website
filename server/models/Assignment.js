import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
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

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    instructions: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    dueDate: {
      type: String,
      required: true,
    },

    resourceLink: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["assigned", "submitted", "reviewed"],
      default: "assigned",
    },

    submissionText: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    submissionLink: {
      type: String,
      default: "",
      trim: true,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    tutorFeedback: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

assignmentSchema.index({
  tutor: 1,
  student: 1,
  dueDate: 1,
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;