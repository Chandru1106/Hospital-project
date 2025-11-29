const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Consultation = sequelize.define('Consultation', {
    visit_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    visit_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    present_history: {
        type: DataTypes.TEXT
    },
    diagnosis: {
        type: DataTypes.TEXT
    },
    treatment: {
        type: DataTypes.TEXT
    },
    bp: {
        type: DataTypes.STRING // e.g., "120/80"
    },
    pr: {
        type: DataTypes.INTEGER // Pulse Rate
    },
    temp: {
        type: DataTypes.FLOAT // Temperature
    },
    rbs: {
        type: DataTypes.INTEGER // Random Blood Sugar
    },
    review_date: {
        type: DataTypes.DATEONLY
    }
});

const Image = require('./Image');

Consultation.hasMany(Image, { foreignKey: 'visit_id' });
Image.belongsTo(Consultation, { foreignKey: 'visit_id' });

module.exports = Consultation;
