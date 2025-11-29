const sequelize = require('./config/database');
const User = require('./models/User');

const verifyAndFixAdmin = async () => {
    try {
        await sequelize.sync();

        const adminEmail = 'admin@hospital.com';
        let adminUser = await User.findOne({ where: { email: adminEmail } });

        if (adminUser) {
            console.log(`Found admin user. Username: ${adminUser.username}, Role: ${adminUser.role}`);

            // Force update username and password
            adminUser.username = 'admin';
            adminUser.password = 'admin123'; // This will be hashed by the model hook
            await adminUser.save();

            console.log('Admin username set to "admin" and password reset to "admin123"');
        } else {
            console.log('Admin user not found. Creating...');
            await User.create({
                username: 'admin',
                email: adminEmail,
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin user created.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

verifyAndFixAdmin();
