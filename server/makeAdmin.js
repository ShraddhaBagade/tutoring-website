import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDatabase from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const adminEmail = process.argv[2]?.trim().toLowerCase();

async function makeAdmin() {
  try {
    if (!adminEmail) {
      console.log("Please provide an email address.");
      return;
    }

    await connectDatabase();

    const user = await User.findOneAndUpdate(
      { email: adminEmail },
      { accountType: "admin" },
      { new: true }
    );

    if (!user) {
      console.log("No user was found with that email address.");
      return;
    }

    console.log(`${user.email} is now an admin.`);
  } catch (error) {
    console.error("Unable to make user an admin:", error.message);
  } finally {
    await mongoose.connection.close();
  }
}

makeAdmin();