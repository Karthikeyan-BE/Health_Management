import consultationModel from '../models/consultation.model.js';
import mongoose from 'mongoose';


export const getPendingConsultations = async (req, res) => {
    try {
        const consultations = await consultationModel.find({ status: 'pending' })
            .populate('patient', 'name email') // Show patient's name
            .sort({ createdAt: 1 }); // Show oldest first

        res.status(200).json(consultations);

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
};


export const assignConsultation = async (req, res) => {
    try {
        const consultationId = req.params.id;
        const doctorId = req.user._id;

        const consultation = await consultationModel.findById(consultationId);

        if (!consultation) {
            return res.status(404).json({ Error: 'Consultation not found' });
        }

        if (consultation.status !== 'pending') {
            return res.status(400).json({ Error: 'Consultation is already assigned or resolved' });
        }

        consultation.doctor = doctorId;
        consultation.status = 'assigned';

        const updatedConsultation = await consultation.save();
        res.status(200).json(updatedConsultation);

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
};


export const getAssignedConsultations = async (req, res) => {
    try {
        const consultations = await consultationModel.find({
            doctor: req.user._id,
            status: 'assigned', // Only find unresolved ones
        })
            .populate('patient', 'name email')
            .sort({ createdAt: 1 });

        res.status(200).json(consultations);

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
};


export const resolveConsultation = async (req, res) => {
    try {
        const { solution } = req.body;
        const consultationId = req.params.id;

        if (!solution) {
            return res.status(400).json({ Error: 'Solution is required' });
        }

        const consultation = await consultationModel.findById(consultationId);

        if (!consultation) {
            return res.status(404).json({ Error: 'Consultation not found' });
        }

        // Check if the doctor is the one assigned
        if (consultation.doctor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ Error: 'Not authorized to resolve this consultation' });
        }

        consultation.solution = solution;
        consultation.status = 'resolved';

        const updatedConsultation = await consultation.save();
        res.status(200).json(updatedConsultation);

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
};


export const getConsultationByIdForDoctor = async (req, res) => {
    try {
        const consultationId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(consultationId)) {
             return res.status(404).json({ Error: 'Consultation not found' });
        }
        
        const consultation = await consultationModel.findById(consultationId)
            .populate('patient', 'name email')
            .populate('doctor', 'name specialization');

        if (!consultation) {
            return res.status(404).json({ Error: 'Consultation not found' });
        }

        // --- Authorization Check ---
        // Allow only if the user is the assigned doctor
        if (!consultation.doctor || consultation.doctor._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ Error: 'Not authorized to view this consultation' });
        }
        
        res.status(200).json(consultation);

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
};