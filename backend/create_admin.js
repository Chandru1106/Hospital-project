const sequelize = require('./config/database');
const User = require('./models/User');

const createAdmin = async () => {
    try {
        await sequelize.sync();

        // 1. Create/Update Admin
        const adminEmail = 'admin@hospital.com';
        let admin = await User.findOne({ where: { email: adminEmail } });

        if (admin) {
            console.log('Updating existing admin...');
            admin.username = 'admin';
            admin.password = 'password123'; // Will be hashed by hook
            admin.role = 'admin';
            await admin.save();
        } else {
            console.log('Creating new admin...');
            await User.create({
                username: 'admin',
                email: adminEmail,
                password: 'password123',
                role: 'admin'
            });
        }
        console.log('Admin user ready: admin / password123');

        // 2. Create/Update Test Patient User (for verification)
        const patientEmail = 'rickychandru6@gmail.com';
        let patientUser = await User.findOne({ where: { email: patientEmail } });

        if (patientUser) {
            console.log('Updating existing patient user...');
            patientUser.password = 'password123';
            await patientUser.save();
        } else {
            console.log('Creating new patient user...');
            await User.create({
                username: 'ricky',
                email: patientEmail,
                password: 'password123',
                role: 'user'
            });
        }
        console.log('Patient user ready: ricky / password123');

    } catch (error) {
        console.error('Error setup users:', error);
    } finally {
        await sequelize.close();
    }
};

createAdmin();
