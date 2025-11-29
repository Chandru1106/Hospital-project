const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const verifyAdminFlow = async () => {
    try {
        // 1. Login as Admin
        console.log('Logging in as admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Login successful. Token received.');

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 2a. Create Patient WITHOUT Login
        console.log('Creating new patient WITHOUT login...');
        const uniqueSuffix = Date.now();
        const patientNoLoginData = {
            name: `Test Patient NoLogin ${uniqueSuffix}`,
            age: 25,
            sex: 'Female',
            mobile: '9876543210',
            address: '456 Test Ave',
            createLogin: false
        };
        try {
            const createPatientNoLoginRes = await axios.post(`${API_URL}/patients`, patientNoLoginData, config);
            console.log('Patient (No Login) created:', createPatientNoLoginRes.data);
        } catch (e) {
            console.error('Failed to create patient without login:', e.response ? e.response.data : e.message);
        }

        // 2b. Create Patient WITH Login
        console.log('Creating new patient WITH login...');
        const patientData = {
            name: `Test Patient ${uniqueSuffix}`,
            age: 30,
            sex: 'Male',
            mobile: '1234567890',
            address: '123 Test St',
            username: `testuser${uniqueSuffix}`,
            email: `testuser${uniqueSuffix}@example.com`,
            password: 'password123',
            createLogin: true
        };

        const createPatientRes = await axios.post(`${API_URL}/patients`, patientData, config);
        console.log('Patient (With Login) created:', createPatientRes.data);
        const patientId = createPatientRes.data.patient_id;

        // 3. Book Appointment for Patient
        console.log('Booking appointment for new patient...');
        const appointmentData = {
            patient_id: patientId,
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            time: '10:00',
            type: 'new',
            notes: 'Initial checkup via Admin API'
        };

        const createAppointmentRes = await axios.post(`${API_URL}/appointments`, appointmentData, config);
        console.log('Appointment booked:', createAppointmentRes.data);

        console.log('VERIFICATION SUCCESSFUL!');

    } catch (error) {
        console.error('VERIFICATION FAILED:', JSON.stringify(error.response ? error.response.data : error.message, null, 2));
    }
};

verifyAdminFlow();
