try {
    console.log('Requiring HealthRecord...');
    const HealthRecord = require('./models/HealthRecord');
    console.log('HealthRecord loaded successfully.');
} catch (error) {
    console.error('Error loading HealthRecord:', error);
}
