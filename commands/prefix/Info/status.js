const { EmbedBuilder } = require('discord.js');
const status = require('../../../functions/status');

const getStatus = () => {

}

module.exports = {
  config: {
    name: 'status',
    description: 'displays the status of everything',
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config, db) => {

    const apiStatus = await status();

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Aqua')
          .setTitle('Status')
          .setDescription(`Status of all services`)
          .addFields(
            { name: 'App Status', value: '✅ Good' },
            { name: 'API Status (tadpole)', value: `${apiStatus === 'success' ? '✅ Good': '🚨 Failing'}` },
            { name: 'VALORANT Status', value: 'tbd' },
            { name: 'Client Latency', value: `\`${client.ws.ping}\` ms.`}
          )
      ]
    });
  },
};
