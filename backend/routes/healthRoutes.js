const express = require('express');
const router = express.Router();
const HealthRecord = require('../models/HealthRecord');
const authController = require('../controllers/authController');
const { Op } = require('sequelize');

// Middleware
const auth = authController.verifyToken;

// Get all health records for a user
router.get('/records', auth, async (req, res) => {
    try {
        const records = await HealthRecord.findAll({
            where: { userId: req.userId },
            order: [['timestamp', 'DESC']],
            limit: 30
        });
        res.json(records);
    } catch (error) {
        const fs = require('fs');
        fs.writeFileSync('db_error.txt', `${error.message}\n${error.stack}`);
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add new health record
router.post('/records', auth, async (req, res) => {
    try {
        const { type, value, systolic, diastolic, note } = req.body;

        const record = await HealthRecord.create({
            userId: req.userId,
            type,
            value,
            systolic,
            diastolic,
            note,
            timestamp: new Date()
        });

        res.status(201).json(record);
    } catch (error) {
        console.error('Error adding record:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get health statistics
router.get('/statistics', auth, async (req, res) => {
    try {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // Get recent records (last 7 days)
        const recentRecords = await HealthRecord.findAll({
            where: {
                userId: req.userId,
                timestamp: { [Op.gte]: sevenDaysAgo }
            }
        });

        // Get previous records (7-14 days ago)
        const previousRecords = await HealthRecord.findAll({
            where: {
                userId: req.userId,
                timestamp: {
                    [Op.gte]: fourteenDaysAgo,
                    [Op.lt]: sevenDaysAgo
                }
            }
        });

        // Calculate statistics
        const stats = {
            heartRate: calculateTrend(
                recentRecords.filter(r => r.type === 'heartRate'),
                previousRecords.filter(r => r.type === 'heartRate')
            ),
            bloodPressure: calculateBPTrend(
                recentRecords.filter(r => r.type === 'bloodPressure'),
                previousRecords.filter(r => r.type === 'bloodPressure')
            ),
            hasData: recentRecords.length > 0
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Helper function to calculate trend
function calculateTrend(recent, previous) {
    if (recent.length === 0) {
        return { average: 0, trend: 'none', change: 0 };
    }

    const recentAvg = recent.reduce((sum, r) => sum + r.value, 0) / recent.length;

    if (previous.length === 0) {
        return { average: Math.round(recentAvg), trend: 'stable', change: 0 };
    }

    const previousAvg = previous.reduce((sum, r) => sum + r.value, 0) / previous.length;
    const change = ((recentAvg - previousAvg) / previousAvg) * 100;

    let trend = 'stable';
    if (change > 5) trend = 'increasing';
    else if (change < -5) trend = 'decreasing';

    return {
        average: Math.round(recentAvg),
        trend,
        change: Math.round(change)
    };
}

// Helper function for blood pressure trend
function calculateBPTrend(recent, previous) {
    if (recent.length === 0) {
        return { systolic: 0, diastolic: 0, trend: 'none', change: 0 };
    }

    const recentSystolic = recent.reduce((sum, r) => sum + r.systolic, 0) / recent.length;
    const recentDiastolic = recent.reduce((sum, r) => sum + r.diastolic, 0) / recent.length;

    if (previous.length === 0) {
        return {
            systolic: Math.round(recentSystolic),
            diastolic: Math.round(recentDiastolic),
            trend: 'stable',
            change: 0
        };
    }

    const previousSystolic = previous.reduce((sum, r) => sum + r.systolic, 0) / previous.length;
    const change = ((recentSystolic - previousSystolic) / previousSystolic) * 100;

    let trend = 'stable';
    if (change > 5) trend = 'increasing';
    else if (change < -5) trend = 'decreasing';

    return {
        systolic: Math.round(recentSystolic),
        diastolic: Math.round(recentDiastolic),
        trend,
        change: Math.round(change)
    };
}

module.exports = router;
