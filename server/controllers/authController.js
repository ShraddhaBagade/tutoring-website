import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export const signup = async (req, res) => {
  try {
    const { accountType, fullName, email, password } = req.body;

    if (!accountType || !fullName || !email || !password) {
      return res.status(400).json({
        message: "Please complete all fields.",
      });
    }

    if (!["student", "parent"].includes(accountType)) {
      return res.status(400).json({
        message: "Please select student or parent.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      accountType,
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user._id,
        accountType: user.accountType,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Unable to create account.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter your email and password.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, getCookieOptions());

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        accountType: user.accountType,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Unable to log in.",
    });
  }
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user._id,
      accountType: req.user.accountType,
      fullName: req.user.fullName,
      email: req.user.email,
    },
  });
};

export const logout = async (req, res) => {
  const { maxAge, ...clearCookieOptions } = getCookieOptions();

  res.clearCookie("token", clearCookieOptions);

  return res.status(200).json({
    message: "Logged out successfully.",
  });
};