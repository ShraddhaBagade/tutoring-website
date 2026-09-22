import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    accountType: {
      type: String,
      enum: ["student", "parent", "tutor", "admin"],
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;