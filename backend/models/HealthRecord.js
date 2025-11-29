const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const HealthRecord = sequelize.define('HealthRecord', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    type: {
        type: DataTypes.ENUM('heartRate', 'bloodPressure', 'weight', 'temperature'),
        allowNull: false
    },
    value: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    systolic: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    diastolic: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    note: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Define association
HealthRecord.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(HealthRecord, { foreignKey: 'userId' });

module.exports = HealthRecord;
