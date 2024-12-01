const app = require('../src/app');

// Export as a serverless function
module.exports = (req, res) => {
  app(req, res);
};