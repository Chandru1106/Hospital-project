import sequelize from './config/database.js';
import User from './models/User.js';
import Patient from './models/Patient.js';
import bcrypt from 'bcryptjs';

const createPatient = async () => {
    try {
        await sequelize.sync();

        const hashedPassword = await bcrypt.hash('patient123', 10);

        // Check if user exists
        let user = await User.findOne({ where: { username: 'patient' } });

        if (!user) {
            user = await User.create({
                username: 'patient',
                email: 'patient@example.com',
                password: hashedPassword,
                role: 'patient'
            });
            console.log('Patient user created');
        } else {
            console.log('Patient user already exists');
            // Update password just in case
            user.password = hashedPassword;
            await user.save();
        }

        // Check if patient record exists
        let patient = await Patient.findOne({ where: { user_id: user.user_id } });

        if (!patient) {
            patient = await Patient.create({
                user_id: user.user_id,
                name: 'John Doe',
                age: 30,
                gender: 'Male',
                contact_number: '1234567890',
                medical_history: 'None'
            });
            console.log('Patient record created');
        } else {
            console.log('Patient record already exists');
        }

        console.log('Test patient setup complete');
    } catch (error) {
        console.error('Error creating patient:', error);
    } finally {
        await sequelize.close();
    }
};

createPatient();
