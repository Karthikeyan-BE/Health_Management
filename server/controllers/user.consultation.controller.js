import consultationModel from '../models/consultation.model.js';
import mongoose from 'mongoose';

export const createConsultation = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms) {
            return res.status(400).json({ Error: 'Symptoms description is required' });
        }

        const consultation = await consultationModel.create({
            patient: req.user._id, // Set patient from logged-in user
            symptoms,
            status: 'pending',
        });

        res.status(201).json(consultation);

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
};


export const getMyConsultations = async (req, res) => {
    try {
        const consultations = await consultationModel.find({ patient: req.user._id })
            .populate('doctor', 'name specialization') // Show doctor's name
            .sort({ createdAt: -1 }); // Show newest first

        res.status(200).json(consultations);

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
};


export const getConsultationById = async (req, res) => {
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
        if (consultation.patient._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ Error: 'Not authorized to view this consultation' });
        }
        
        res.status(200).json(consultation);

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
};