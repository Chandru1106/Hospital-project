const sequelize = require('./config/database');
const User = require('./models/User');

async function seedAdmin() {
    try {
        await sequelize.sync();

        const existingAdmin = await User.findOne({ where: { email: 'admin@hospital.com' } });

        if (!existingAdmin) {
            await User.create({
                username: 'Admin',
                email: 'admin@hospital.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('✅ Default admin user created: admin@hospital.com / admin123');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
