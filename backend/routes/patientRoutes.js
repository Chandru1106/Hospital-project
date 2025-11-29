const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authController = require('../controllers/authController');

// Protected routes - require authentication
router.use(authController.verifyToken);

// User-specific profile routes
router.get('/my-profile', patientController.getMyProfile);
router.post('/my-profile', patientController.createMyProfile);
router.put('/my-profile', patientController.updateMyProfile);

// General patient routes (with role-based access)
router.get('/', patientController.getAllPatients);
router.post('/', patientController.createPatient);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

module.exports = router;
