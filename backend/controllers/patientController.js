const Patient = require('../models/Patient');
const { Op } = require('sequelize');

// Get current user's profile
exports.getMyProfile = async (req, res) => {
    try {
        const profile = await Patient.findOne({ where: { user_id: req.userId } });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found. Please create your profile.' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create current user's profile
exports.createMyProfile = async (req, res) => {
    try {
        // Check if user already has a profile
        const existingProfile = await Patient.findOne({ where: { user_id: req.userId } });

        if (existingProfile) {
            return res.status(400).json({ error: 'You already have a profile. Please use update instead.' });
        }

        const profileData = {
            ...req.body,
            user_id: req.userId  // Automatically set the user_id
        };

        const profile = await Patient.create(profileData);
        res.status(201).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update current user's profile
exports.updateMyProfile = async (req, res) => {
    try {
        const profile = await Patient.findOne({ where: { user_id: req.userId } });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        await profile.update(req.body);
        res.json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all patients (admin only) or user's own profile
exports.getAllPatients = async (req, res) => {
    try {
        let patients;

        if (req.userRole === 'admin') {
            // Admin can see all patients
            patients = await Patient.findAll();
        } else {
            // Regular users can only see their own profile
            patients = await Patient.findAll({ where: { user_id: req.userId } });
        }

        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const User = require('../models/User');

// ...

// Create patient (admin only or user's own profile)
// Create patient (admin only or user's own profile)
exports.createPatient = async (req, res) => {
    try {
        let userId = req.userId; // Default to current user (if creating own profile)

        // If Admin is creating the patient
        if (req.userRole === 'admin') {
            const { username, email, password, role, ...patientDetails } = req.body;

            // If credentials provided, create a User account first
            if (username && password && email) {
                // Check if user exists
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(400).json({ error: 'User with this email already exists' });
                }

                const newUser = await User.create({
                    username,
                    email,
                    password,
                    role: 'user' // Force role to 'user' for patients
                });
                userId = newUser.user_id;
                console.log('New User Created. ID:', userId);
            } else {
                userId = null; // Create patient without login
            }
        }

        console.log('Creating patient with userId:', userId);

        const patientData = {
            ...req.body,
            user_id: userId || null
        };

        console.log('Patient Data:', JSON.stringify(patientData));

        try {
            const patient = await Patient.create(patientData);
            console.log('Patient created successfully:', patient.patient_id);
            res.status(201).json(patient);
        } catch (dbError) {
            console.error('Database Error during Patient.create:', dbError);
            throw dbError;
        }
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(400).json({ error: error.message });
    }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id);

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Check if user has permission to view this patient
        if (req.userRole !== 'admin' && patient.user_id !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update patient
exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id);

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Check if user has permission to update this patient
        if (req.userRole !== 'admin' && patient.user_id !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await patient.update(req.body);
        res.json(patient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete patient (admin only)
exports.deletePatient = async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Only admins can delete patients' });
        }

        const patient = await Patient.findByPk(req.params.id);

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        await patient.destroy();
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
