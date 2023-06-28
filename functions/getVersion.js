const axios = require('axios');
require('dotenv').config();

const { npm_package_version } = process.env; // eslint-disable-line

module.exports = () => npm_package_version; // eslint-disable-line
