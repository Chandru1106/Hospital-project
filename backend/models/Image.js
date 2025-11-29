const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Image = sequelize.define('Image', {
    image_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    visit_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Image;
