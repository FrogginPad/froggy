const { EmbedBuilder } = require('discord.js');
const status = require('../../../functions/status');

const statusText = {
  success: '✅ Good',
  maintenances: '🔧 Maintenance',
  incidents: '🚨 Incidents',
};

module.exports = {
  config: {
    name: 'status',
    description: 'displays the status of everything',
    usage: '!status',
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
          .setDescription('Status of all services')
          .addFields(
            { name: 'App Status', value: `${statusText.success}` },
            { name: 'API Status (tadpole)', value: `${apiStatus.data.status === 'success' ? `${statusText.success}` : `${statusText.incident}`}` },
            { name: 'Client Latency', value: `\`${client.ws.ping}\` ms.` },
          ),
      ],
    });
  },
};