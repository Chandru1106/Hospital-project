const Consultation = require('../models/Consultation');
const Appointment = require('../models/Appointment');
const Image = require('../models/Image');
const Patient = require('../models/Patient');

// Create consultation
exports.createConsultation = async (req, res) => {
    try {
        console.log('Creating consultation with body:', req.body);
        console.log('File:', req.file);
        let { patient_id, visit_date, present_history, diagnosis, treatment, review_date, bp, pr, temp, rbs } = req.body;

        // Sanitize numeric and date fields
        pr = pr === '' ? null : pr;
        temp = temp === '' ? null : temp;
        rbs = rbs === '' ? null : rbs;
        review_date = review_date === '' ? null : review_date;
        bp = bp === '' ? null : bp;
        visit_date = visit_date === '' ? undefined : visit_date; // Let default value handle it if empty
        patient_id = parseInt(patient_id, 10);

        console.log('Parsed values:', { patient_id, visit_date, bp, pr, temp, rbs });

        // 1. Create Consultation Record
        const consultation = await Consultation.create({
            patient_id,
            visit_date,
            present_history,
            diagnosis,
            treatment,
            review_date,
            bp,
            pr,
            temp,
            rbs
        });

        // 2. Handle Image Upload if file is present
        if (req.file) {
            console.log('Creating image record for visit_id:', consultation.visit_id);
            await Image.create({
                visit_id: consultation.visit_id,
                file_path: req.file.path
            });
        }

        // 3. If review_date is present, automatically create an Appointment
        if (review_date) {
            await Appointment.create({
                patient_id,
                date: review_date,
                time: '09:00:00', // Default time, can be adjusted
                type: 'review',
                notes: 'Auto-scheduled review from consultation'
            });
        }

        res.status(201).json(consultation);
    } catch (error) {
        console.error('Error creating consultation:', error);
        if (error.errors) {
            const validationErrors = error.errors.map(e => `${e.path}: ${e.message}`).join(', ');
            return res.status(400).json({ error: validationErrors });
        }
        res.status(400).json({ error: error.message });
    }
};

// Get consultations for a patient
exports.getPatientHistory = async (req, res) => {
    try {
        const { patient_id } = req.params;
        console.log('Fetching history for patient:', patient_id);
        const history = await Consultation.findAll({
            where: { patient_id },
            include: [Image],
            order: [['visit_date', 'DESC']]
        });
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: error.message });
    }
};

// Upload Image for a consultation
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { visit_id } = req.body;
        const image = await Image.create({
            visit_id,
            file_path: req.file.path
        });

        res.status(201).json(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
