import userModel from "../models/user.model.js";
import consultationModel from "../models/consultation.model.js";
import bcrypt from 'bcryptjs';
import mongoose from "mongoose";

export const getAllUsers = async (req, res) => {
    try {
        // Find all users and exclude their password field
        const users = await userModel.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ Error: "User not found" });
        }

        // Add a safety check to prevent an admin from deleting themselves
        if (req.user._id.toString() === userId) {
            return res.status(400).json({ Error: "Admin cannot delete their own account" });
        }

        await userModel.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
};


export const addDoctors = async (req, res) => {
    try {
        const { name, email, password, specialization } = req.body;

        if (!name || !email || !password || !specialization) {
            return res.status(400).json({ Error: "Please provide all fields" });
        }

        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ Error: "Doctor with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Admin creates a doctor, so they are verified by default
        const newDoctor = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: 'doctor',
            specialization,
            isVerified: true 
        });

        res.status(201).json({
            _id: newDoctor._id,
            name: newDoctor.name,
            email: newDoctor.email,
            role: newDoctor.role,
            specialization: newDoctor.specialization,
            isVerified: newDoctor.isVerified,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
};

export const updateDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const { name, email, specialization, isVerified } = req.body;

        const updatedDoctor = await userModel.findByIdAndUpdate(
            doctorId,
            {
                name,
                email,
                specialization,
                isVerified,
            },
            { new: true, runValidators: true } // 'new: true' returns the updated doc
        ).select('-password');

        if (!updatedDoctor) {
            return res.status(404).json({ Error: "Doctor not found" });
        }

        res.status(200).json(updatedDoctor);

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
};


export const deleteDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const doctor = await userModel.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ Error: "Doctor not found" });
        }

        // Verify the user is a doctor before deleting
        if (doctor.role !== 'doctor') {
            return res.status(400).json({ Error: "This user is not a doctor" });
        }

        await userModel.findByIdAndDelete(doctorId);
        res.status(200).json({ message: "Doctor deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
};


export const getAllDoctor = async (req, res) => {
    try {
        // Only find users who are 'doctor' and 'isVerified'
        const doctors = await userModel.find({
            role: 'doctor',
            isVerified: true
        }).select('-password -role'); // No need to send password or role

        res.status(200).json(doctors);

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
};


export const findDoctor = async (req, res) => {
    try {
        const doctor = await userModel.findById(req.params.id).select('-password');

        // Check if doctor exists AND is a verified doctor
        if (!doctor || doctor.role !== 'doctor' || !doctor.isVerified) {
            return res.status(404).json({ Error: "Doctor not found or not verified" });
        }

        res.status(200).json(doctor);

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
};

export const getAllConsultations = async (req, res) => {
    try {
        const consultations = await consultationModel.find({})
            .populate('patient', 'name email')
            .populate('doctor', 'name specialization')
            .sort({ createdAt: -1 }); // Show newest first

        res.status(200).json(consultations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
};

/**
 * @desc    Get a single consultation by ID (Admin only)
 * @route   GET /api/admin/consultations/:id
 * @access  Private (Admin)
 */
export const getConsultationByIdForAdmin = async (req, res) => {
    try {
        const consultationId = req.params.id;

        // Check if the ID is a valid Mongoose ObjectId
        if (!mongoose.Types.ObjectId.isValid(consultationId)) {
             return res.status(404).json({ Error: 'Consultation not found' });
        }

        const consultation = await consultationModel.findById(consultationId)
            .populate('patient', 'name email')
            .populate('doctor', 'name specialization');

        if (!consultation) {
            return res.status(404).json({ Error: 'Consultation not found' });
        }

        // Since this is an admin, no further authorization checks are needed
        res.status(200).json(consultation);

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
};

/**
 * @desc    Admin assigns a specific doctor to a consultation
 * @route   PUT /api/admin/consultations/assign/:id
 * @access  Private (Admin)
 */
export const adminAssignDoctor = async (req, res) => {
    try {
        const { doctorId } = req.body;
        const consultationId = req.params.id;

        // 1. Check if doctorId was provided
        if (!doctorId) {
            return res.status(400).json({ Error: 'Doctor ID is required in the body' });
        }

        // 2. Validate the doctor
        const doctor = await userModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ Error: 'Doctor not found' });
        }
        if (doctor.role !== 'doctor' || !doctor.isVerified) {
            return res.status(400).json({ Error: 'This user is not a verified doctor' });
        }

        // 3. Find the consultation
        const consultation = await consultationModel.findById(consultationId);
        if (!consultation) {
            return res.status(404).json({ Error: 'Consultation not found' });
        }

        // 4. Check if it's already handled
        if (consultation.status !== 'pending') {
            return res.status(400).json({ 
                Error: `Consultation cannot be assigned, status is already: ${consultation.status}` 
            });
        }

        // 5. Assign doctor and update status
        consultation.doctor = doctorId;
        consultation.status = 'assigned';
        
        await consultation.save();

        // 6. Send back the updated consultation
        const updatedConsultation = await consultationModel.findById(consultationId)
            .populate('patient', 'name')
            .populate('doctor', 'name specialization');

        res.status(200).json(updatedConsultation);

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
};

/**
 * @desc    Verify a doctor
 * @route   PUT /api/admin/doctors/verify/:id
 * @access  Private (Admin)
 */
export const verifyDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Check for valid ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ Error: "Doctor not found" });
    }

    const doctor = await userModel.findById(id);

    // Check if user exists and is a doctor
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ Error: "Doctor not found" });
    }

    // Check if already verified
    if (doctor.isVerified) {
      return res.status(400).json({ Error: "Doctor is already verified" });
    }

    // Verify the doctor
    doctor.isVerified = true;
    await doctor.save();

    res.status(200).json({ message: "Doctor verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

/**
 * @desc    Delete any consultation
 * @route   DELETE /api/admin/consultations/:id
 * @access  Private (Admin)
 */
export const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    // Check for valid ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ Error: "Consultation not found" });
    }

    const consultation = await consultationModel.findById(id);

    if (!consultation) {
      return res.status(404).json({ Error: "Consultation not found" });
    }

    // Delete the consultation
    await consultationModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Consultation deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};