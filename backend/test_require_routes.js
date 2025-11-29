try {
    console.log('Requiring healthRoutes...');
    const healthRoutes = require('./routes/healthRoutes');
    console.log('healthRoutes loaded successfully.');
} catch (error) {
    console.error('Error loading healthRoutes:', error);
}
