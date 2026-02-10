const sequelize = require('../config/db');
const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const Notification = require('../models/Notification');

async function initDb() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // In production, you might want to use migrations
        await sequelize.sync({ alter: true });
        console.log('All MySQL models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the MySQL database:', error.message);
        if (error.message.includes('Unknown database')) {
            console.error('--- CRITICAL: Please create the database "leave_management_db" in your MySQL server! ---');
        }
    }
}

module.exports = initDb;
