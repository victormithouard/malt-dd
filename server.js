const express = require('express');
const app = express();
const path = require('path');

// Railway automatically provides a port via the process.env.PORT variable
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Send index.html for the root route (optional, but good for safety)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/ai', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ai.html'));
});

app.get('/composable-evolution', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'composable-evolution.html'));
});


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});