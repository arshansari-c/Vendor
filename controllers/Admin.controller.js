import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.model.js";
import { CreateAndSaveCookie } from "../jwt/AuthToken.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }


    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    const newUser = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    CreateAndSaveCookie({userId:newUser._id,res})
    return res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // ✅ Use body, not params

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    CreateAndSaveCookie({userId:user._id,res})
    return res.status(200).json({ message: "Login successfully" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const logout = async (req, res) => {
  try {
    const token = req.cookies.jwt; // ✅ Correct way to access cookie

    if (!token) {
      return res.status(400).json({ message: "Already logged out" });
    }

    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return res.status(200).json({ message: "Logout successfully" }); // ✅ Use 200
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const FetchAdminProfile = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID not found in request" });
    }

    const admin = await Admin.findById(userId).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      user: admin
    });

  } catch (error) {
    console.log("FetchAdminProfile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const UpdateAdminDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, email, password } = req.body;

    const findUser = await Admin.findById(userId);
    if (!findUser) {
      return res.status(400).json({ message: "Invalid User" });
    }

    const updatedFields = {};

    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 7);
      updatedFields.password = hashedPassword;
    }

    const updatedUser = await Admin.findByIdAndUpdate(
      userId,
      updatedFields,
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("UpdateAdminDetail error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};