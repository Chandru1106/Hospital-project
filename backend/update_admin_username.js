const sequelize = require('./config/database');
const User = require('./models/User');

const updateAdminUsername = async () => {
    try {
        await sequelize.sync();

        const adminEmail = 'admin@hospital.com';
        const adminUser = await User.findOne({ where: { email: adminEmail } });

        if (adminUser) {
            await adminUser.update({ username: 'admin' });
            console.log('Admin username updated to "admin"');
        } else {
            console.log('Admin user not found');
        }

    } catch (error) {
        console.error('Error updating admin:', error);
    } finally {
        await sequelize.close();
    }
};

updateAdminUsername();
