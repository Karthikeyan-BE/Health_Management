import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

// --- This is your existing 'protect' middleware ---
export const protect = async (req, res, next) => {
    let token;
    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await userModel.findById(decoded.userId).select('-password');

            if (!req.user) {
                 return res.status(401).json({ 'Error': 'Not authorized, user not found' });
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ 'Error': 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ 'Error': 'Not authorized, no token' });
    }
};

// --- NEW: Admin Middleware ---
export const isAdmin = (req, res, next) => {
    // This middleware MUST run AFTER 'protect'
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed
    } else {
        res.status(403).json({ 'Error': 'Not authorized. Admin access only.' });
    }
};

// --- NEW: Doctor Middleware ---
export const isDoctor = (req, res, next) => {
    // This middleware MUST run AFTER 'protect'
    if (req.user && req.user.role === 'doctor' && req.user.isVerified) {
        next(); // User is a verified doctor, proceed
    } else if (req.user && req.user.role === 'doctor' && !req.user.isVerified) {
        res.status(403).json({ 'Error': 'Not authorized. Doctor account not verified.' });
    } else {
        res.status(403).json({ 'Error': 'Not authorized. Doctor access only.' });
    }
};