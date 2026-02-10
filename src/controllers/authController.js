const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, className, teacherId, teacherName } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({
            name, email, password, role, className, teacherId, teacherName
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                className: user.className,
                teacherId: user.teacherId,
                teacherName: user.teacherName
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTeachers = async (req, res) => {
    try {
        const teachers = await User.findAll({
            where: { role: 'Teacher' },
            attributes: ['id', 'name']
        });
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            className: user.className,
            teacherId: user.teacherId,
            teacherName: user.teacherName
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
