const sequelize = require('./config/database');
const User = require('./models/User');
const { Op } = require('sequelize');

const testLogin = async () => {
    try {
        await sequelize.sync();

        const username = 'admin';
        const password = 'admin123';

        console.log(`Testing login for username: ${username}, password: ${password}`);

        // Simulate the controller logic
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: username },
                    { username: username }
                ]
            }
        });

        if (!user) {
            console.error('❌ User not found!');
            return;
        }

        console.log(`✅ User found: ${user.username} (${user.email})`);
        console.log(`Stored password hash: ${user.password}`);

        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            console.log('✅ Password match! Login successful.');
        } else {
            console.error('❌ Password mismatch!');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

testLogin();
