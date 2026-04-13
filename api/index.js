const server = require('../backend/server');

// Export the serverless function for Vercel
module.exports = (req, res) => {
  server(req, res);
};
