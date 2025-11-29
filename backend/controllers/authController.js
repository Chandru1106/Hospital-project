const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register new user (admin only)
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = await User.create({ username, email, password, role });

        res.status(201).json({
            message: 'User created successfully',
            user: { id: user.user_id, username: user.username, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if input is email or username
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { username: email }
                ]
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.user_id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Middleware to verify token
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
