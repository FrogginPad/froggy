const axios = require('axios');
require('dotenv').config();

const { npm_package_version } = process.env;

module.exports = () => {
  return npm_package_version;
};
