const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');
const Consultation = require('./models/Consultation');
const Image = require('./models/Image');
const User = require('./models/User');
const HealthRecord = require('./models/HealthRecord');

const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/support', require('./routes/supportRoutes'));

// Associations
Patient.hasMany(Appointment, { foreignKey: 'patient_id' });
Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });

Patient.hasMany(Consultation, { foreignKey: 'patient_id' });
Consultation.belongsTo(Patient, { foreignKey: 'patient_id' });

Consultation.hasMany(Image, { foreignKey: 'visit_id' });
Image.belongsTo(Consultation, { foreignKey: 'visit_id' });

// Test DB Connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

// Basic Route
app.get('/', (req, res) => {
    res.send('Hospital Management System API');
});

// Sync Database & Start Server
sequelize.sync({ alter: true }) // alter: true updates tables to match models
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.log('Error syncing database: ' + err));
