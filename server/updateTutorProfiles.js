import dotenv from "dotenv";
import connectDatabase from "./config/db.js";
import Tutor from "./models/Tutor.js";

dotenv.config();

try {
  await connectDatabase();

  await Tutor.updateOne(
    { tutorId: 4 },
    {
      $set: {
        name: "Priya Shah",
        email: "priya.shah@edumodern.com",
      },
    }
  );

  await Tutor.updateOne(
    { tutorId: 6 },
    {
      $set: {
        image: "/images/tutors/alex-morgan.png",
      },
    }
  );

  console.log("Tutor profiles updated successfully.");
  process.exit(0);
} catch (error) {
  console.error("Unable to update tutor profiles:", error.message);
  process.exit(1);
}