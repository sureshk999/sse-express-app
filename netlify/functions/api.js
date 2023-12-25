const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
const router = express.Router();

// Enable CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use('/public', express.static('public'));

// Regular route
router.get('/', (req, res) => {
  res.send('Hello World! Navigate to /api/events for SSE.');
});

// SSE route (adapted for serverless, might not work as expected due to limitations)
router.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const intervalId = setInterval(function() {
    const message = `data: Server time is ${new Date().toLocaleTimeString()}\n\n`;
    res.write(message);
  }, 1000);

  req.on('close', function() {
    clearInterval(intervalId);
  });
});

// Use the router
app.use('/.netlify/functions/api', router); // path must route to lambda

module.exports.handler = serverless(app);
