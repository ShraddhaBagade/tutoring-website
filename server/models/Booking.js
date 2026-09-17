import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tutorId: {
      type: Number,
      required: true,
    },

    tutorName: {
      type: String,
      required: true,
      trim: true,
    },

    tutorImage: {
      type: String,
      default: "",
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    sessionType: {
      type: String,
      enum: ["Online", "In Person"],
      required: true,
    },

    sessionDate: {
      type: String,
      required: true,
    },

    sessionTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index(
  {
    tutorId: 1,
    sessionDate: 1,
    sessionTime: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: "upcoming",
    },
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;