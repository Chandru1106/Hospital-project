const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
    patient_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,  // Nullable for backward compatibility
        references: {
            model: 'Users',
            key: 'user_id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sex: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    occupation: {
        type: DataTypes.STRING
    },
    dm: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    ht: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    heart_disease: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    thyroid_disorder: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    allergy: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    allergy_details: {
        type: DataTypes.TEXT
    },
    current_bpm: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

module.exports = Patient;
