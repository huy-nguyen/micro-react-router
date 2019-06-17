const { setup: setupPuppeteer } = require('jest-environment-puppeteer')

module.exports = async function globalSetup(globalConfig) {
  await setupPuppeteer(globalConfig)
  // Add queries from @testing-library/dom to puppeteer:
  require('pptr-testing-library/extend')
}
