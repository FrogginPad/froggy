const { EmbedBuilder } = require('discord.js');
const status = require('../../../functions/status');
const valStatus = require('../../../functions/valStatus');

const statusText = {
  success: '✅ Good',
  maintenances: '🔧 Maintenance',
  incidents: '🚨 Incidents',
};

const severityText = {
  warning: '⚠️ Warning',
  info: 'ℹ️ Info',
  critical: '🚨 Critical',
};

const generateValStatusText = (data) => {
  if (data.status === 'success') { return statusText.success; }

  if (data.status === 'maintenances') {
    return `${statusText.maintenances}\n${data.title}\n Status: ${data.maintenance_status}`;
  }

  if (data.status === 'incidents') {
    return `${severityText[data.severity]}\n${data.title}`;
  }
};

module.exports = {
  config: {
    name: 'status',
    description: 'displays the status of everything',
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config, db) => {
    const apiStatus = await status();
    const valApiStatus = await valStatus();

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Aqua')
          .setTitle('Status')
          .setDescription('Status of all services')
          .addFields(
            { name: 'App Status', value: `${statusText.success}` },
            { name: 'API Status (tadpole)', value: `${apiStatus.data.status === 'success' ? `${statusText.success}` : `${statusText.incident}`}` },
            { name: 'VALORANT Status', value: `${generateValStatusText(valApiStatus.data)}` },
            { name: 'Client Latency', value: `\`${client.ws.ping}\` ms.` },
          ),
      ],
    });
  },
};
