import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDatabase from "./config/db.js";
import Tutor from "./models/Tutor.js";

dotenv.config();

async function cleanupTutors() {
  try {
    await connectDatabase();

    const result = await Tutor.deleteMany({
      tutorId: { $exists: false },
    });

    console.log(
      `${result.deletedCount} old duplicate tutor record(s) removed.`
    );
  } catch (error) {
    console.error("Unable to remove duplicate tutors:", error.message);
  } finally {
    await mongoose.connection.close();
  }
}

cleanupTutors();