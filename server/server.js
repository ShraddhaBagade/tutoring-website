import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDatabase from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import tutorRoutes from "./routes/tutorRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import lessonNoteRoutes from "./routes/lessonNoteRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .flatMap((origin) => origin.split(","))
  .map((origin) => origin.trim());

app.set("trust proxy", 1);

await connectDatabase();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("This origin is not allowed to access the API.")
      );
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/lesson-notes", lessonNoteRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "EduModern API is working",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});