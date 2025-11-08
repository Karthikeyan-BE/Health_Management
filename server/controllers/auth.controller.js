import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevents CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// --- Controller Functions ---

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ Error: "Please provide all fields" });
    }

    // 2. Check if user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ Error: "User already exists" });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      // 'role' will default to 'user' from your schema
    });

    if (newUser) {
      // 5. Generate token and set cookie
      generateTokenAndSetCookie(newUser._id, res);

      // 6. Send user data back (without password)
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ Error: "Invalid user data" });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await userModel.findOne({ email });

    // 2. Check user and password
    if (user && (await bcrypt.compare(password, user.password))) {
      // 3. Generate token and set cookie
      generateTokenAndSetCookie(user._id, res);

      // 4. Send user data back (without password)
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ Error: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the cookie by setting it to an empty value and expiring it
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

export const verifyUser = async (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      });
    } else {
      res.status(401).json({ Error: "Not authorized, no user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};
