const path = require('path');
const originalConfigPath = path.join(__dirname, 'jest-puppeteer.config.js');
const originalConfig = require(originalConfigPath);

let launchOptions;
if ('launch' in originalConfig) {
  launchOptions = originalConfig.launch;
} else {
  launchOptions = {};
  originalConfig.launch = launchOptions;
}

launchOptions.headless = false;
launchOptions.slowMo = 200;

module.exports = originalConfig;
