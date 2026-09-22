import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDatabase from "./config/db.js";
import Tutor from "./models/Tutor.js";

dotenv.config();

const sessionTimes = [
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

const availableDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const tutors = [
  {
    tutorId: 1,
    name: "Sarah Mitchell",
    email: "sarah.mitchell@edumodern.com",
    subject: "Mathematics",
    experience: "8 years",
    bio: "Makes mathematics easier through clear explanations and guided practice.",
    image: "/images/tutors/math-tutor.png",
    times: sessionTimes,
  },
  {
    tutorId: 2,
    name: "Daniel Carter",
    email: "daniel.carter@edumodern.com",
    subject: "Science",
    experience: "6 years",
    bio: "Teaches science through practical examples and interactive lessons.",
    image: "/images/tutors/science-tutor.png",
    times: sessionTimes,
  },
  {
    tutorId: 3,
    name: "Olivia Brown",
    email: "olivia.brown@edumodern.com",
    subject: "Social Studies",
    experience: "9 years",
    bio: "Helps students understand history, geography, and social studies concepts.",
    image: "/images/tutors/social-studies-tutor.png",
    times: sessionTimes,
  },
  {
    tutorId: 4,
    name: "Priya Shah",
    email: "priya.shah@edumodern.com",
    subject: "Computer Skills",
    experience: "5 years",
    bio: "Builds student confidence in essential computer and digital skills.",
    image: "/images/tutors/computer-tutor.png",
    times: sessionTimes,
  },
  {
    tutorId: 5,
    name: "Daniel D'Souza",
    email: "daniel.dsouza@edumodern.com",
    subject: "English",
    experience: "7 years",
    bio: "Supports reading, writing, grammar, and communication skills.",
    image: "/images/tutors/english-tutor.png",
    times: sessionTimes,
  },
];

async function seedTutors() {
  try {
    await connectDatabase();

    for (const tutor of tutors) {
      await Tutor.updateOne(
        { tutorId: tutor.tutorId },
        {
          $set: {
            ...tutor,
            availableDays,
            status: "active",
            active: true,
          },
        },
        { upsert: true }
      );
    }

    console.log("Tutors updated successfully.");
  } catch (error) {
    console.error("Unable to seed tutors:", error.message);
  } finally {
    await mongoose.connection.close();
  }
}

seedTutors();