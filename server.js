const express = require('express');
const path = require('path');
const app = require('./api/index');

const PORT = process.env.PORT || 3000;

// Serve static frontend files for local development
app.use(express.static(path.join(__dirname, './')));

// Fallback to index.html for main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  🚀 UConnect Fullstack Application Server Running!`);
    console.log(`  -------------------------------------------------------`);
    console.log(`  🌐 Website URL:  http://localhost:${PORT}`);
    console.log(`  🔑 Login Page:   http://localhost:${PORT}/pages/login.html`);
    console.log(`  📊 Dashboard:    http://localhost:${PORT}/pages/dashboard.html`);
    console.log(`  🔌 API Base:     http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
});
