const getVersion = require('../../../functions/getVersion');

module.exports = {
  config: {
    name: 'version',
    description: 'gets the version of froggy',
    usage: '!version',
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config, db) => {
    message.reply({
      content:`Currently using version ${getVersion()}`
    });
  },
};
