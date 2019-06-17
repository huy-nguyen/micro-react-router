// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // A path to a module which exports an async function that is triggered once before all test suites
  globalSetup: './globalSetup.js',

  // A preset that is used as a base for Jest's configuration
  "preset": "jest-puppeteer",
};
