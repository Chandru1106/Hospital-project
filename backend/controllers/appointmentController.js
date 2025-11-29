const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const { Op } = require('sequelize');

// Create new appointment
// Create new appointment
exports.createAppointment = async (req, res) => {
    try {
        const { date, time, patient_id } = req.body;
        let targetPatientId;

        // Determine patient_id based on role
        if (req.userRole === 'admin') {
            if (!patient_id) {
                return res.status(400).json({ error: 'Patient ID is required for admin booking' });
            }
            targetPatientId = patient_id;
        } else {
            // Regular user: find their linked patient record
            const patient = await Patient.findOne({ where: { user_id: req.userId } });
            if (!patient) {
                return res.status(404).json({ error: 'Patient profile not found. Please create a profile first.' });
            }
            targetPatientId = patient.patient_id;
        }

        // Check for conflicts with existing appointments
        const existingAppointments = await Appointment.findAll({
            where: { date }
        });

        const newTime = new Date(`1970-01-01T${time}`);
        const conflict = existingAppointments.some(apt => {
            const existingTime = new Date(`1970-01-01T${apt.time}`);
            const diff = Math.abs(newTime - existingTime) / 60000; // Difference in minutes
            return diff < 10;
        });

        if (conflict) {
            return res.status(400).json({ error: 'Time slot unavailable. Please allow 10 minutes gap between appointments.' });
        }

        const appointmentData = {
            ...req.body,
            patient_id: targetPatientId
        };

        const appointment = await Appointment.create(appointmentData);
        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all appointments (with optional date filter)
exports.getAppointments = async (req, res) => {
    try {
        const { date, type } = req.query;
        const whereClause = {};

        // Role-based filtering
        if (req.userRole !== 'admin') {
            // Find patient record associated with this user
            const patient = await Patient.findOne({ where: { user_id: req.userId } });

            if (!patient) {
                // If no patient record found for this user, return empty list
                return res.status(200).json([]);
            }

            whereClause.patient_id = patient.patient_id;
        }

        if (date) whereClause.date = date;
        if (type) whereClause.type = type;

        const appointments = await Appointment.findAll({
            where: whereClause,
            include: [{ model: Patient, attributes: ['name', 'mobile'] }],
            order: [['date', 'ASC'], ['time', 'ASC']]
        });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

        await appointment.update(req.body);
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

        await appointment.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
