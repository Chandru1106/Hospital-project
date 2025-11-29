const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), consultationController.createConsultation);
router.get('/patient/:patient_id', consultationController.getPatientHistory);
router.post('/upload', upload.single('image'), consultationController.uploadImage);

module.exports = router;
