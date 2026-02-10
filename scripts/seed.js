const User = require('../src/models/User');
const initDb = require('../src/utils/initDb');
require('dotenv').config();

async function seed() {
    await initDb();
    try {
        const teacher = await User.create({
            name: 'Pro. Supervisor',
            email: 'teacher@example.com',
            password: 'password123',
            role: 'Teacher'
        });
        console.log('--- SEEDING SUCCESSFUL ---');
        console.log('Teacher Account Created:');
        console.log('Email: teacher@example.com');
        console.log('Password: password123');
        console.log('--------------------------');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exit(1);
    }
}

seed();
