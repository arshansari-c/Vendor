import mongoose from "mongoose";
import validator from "validator"; // corrected from 'Validate' to 'validator'

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [5, "Username length must be between 5 to 22 characters"],
    maxlength: [22, "Username length must be between 5 to 22 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: validator.isEmail,
      message: "Invalid email address",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "admin",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be between 6 to 22 characters"],
  },
});

export const Admin = mongoose.model("Admin", AdminSchema);
