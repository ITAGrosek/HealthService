const express = require('express');
const app = express();
const axios = require('axios');

const PORT = 4005;

app.get('/', (req, res) => {
    res.send('Health Check Service is running!');
});

async function checkHttpService(url, name) {
    try {
        const response = await axios.get(url);
        return { name, status: 'Healthy', statusCode: response.status };
    } catch (error) {
        return { name, status: 'Unhealthy', error: error.message };
    }
}

app.get('/health', async (req, res) => {
    try {
        // For local development
        // const bookServiceHealth = await checkHttpService('http://localhost:8080', 'Book Management Service');
        // const reservationServiceHealth = await checkHttpService('http://localhost:8081/reservations', 'Reservation Service');
        // const userServiceHealth = await checkHttpService('http://localhost:3000/api/users', 'User Service');

        // For Docker
        const bookServiceHealth = await checkHttpService('http://book-management-service:8080/api', 'Book Management Service');
        const reservationServiceHealth = await checkHttpService('http://reservation-service:8081', 'Reservation Service');
        const userServiceHealth = await checkHttpService('http://bff-web:3000/api/users', 'User Service');

        res.json([bookServiceHealth, reservationServiceHealth, userServiceHealth]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to perform health check' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});