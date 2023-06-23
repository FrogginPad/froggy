const axios = require('axios');
require('dotenv').config();
const { API_URL } = process.env;

module.exports = async () => {
  const reqConfig = {
    method: "get",
    url: `${API_URL}/coinflip`,
    headers: {
      "Content-Type": "application/json",
    }
  };

  const response = await axios(reqConfig).catch(error => console.log(error));;

  return response;
}
