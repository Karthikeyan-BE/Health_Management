import mongoose from "mongoose";
const consultationSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to the User model
      required: [true, "Patient ID is required"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Also links to the User model
      default: null, // Starts as null, assigned by a doctor
    },
    symptoms: {
      type: String,
      required: [true, "Symptoms description is required"],
      trim: true,
      minlength: [10, "Symptoms must be at least 10 characters long"],
      maxlength: [1000, "Symptoms description cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["pending", "assigned", "resolved"],
        message: "Status must be pending, assigned, or resolved",
      },
      default: "pending",
    },
    solution: {
      type: String,
      trim: true,
      maxlength: [2000, "Solution cannot exceed 2000 characters"],
      default: "",
    },
  },
  {
    // Adds 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

export default mongoose.model("Consultation", consultationSchema);
