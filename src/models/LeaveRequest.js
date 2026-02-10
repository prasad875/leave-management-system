const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LeaveRequest = sequelize.define('LeaveRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    studentName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    studentEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    className: {
        type: DataTypes.STRING,
        allowNull: false
    },
    teacherId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    teacherName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    leaveType: {
        type: DataTypes.ENUM('sick', 'personal', 'emergency', 'family', 'academic', 'casual'),
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    totalDays: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    parentContact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parentEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    teacherComment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    processedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    processedBy: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = LeaveRequest;
