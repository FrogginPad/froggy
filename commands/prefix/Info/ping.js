const { EmbedBuilder } = require('discord.js');

module.exports = {
  config: {
    name: 'ping',
    description: 'Replies with pong!',
    usage: '!ping',
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config, db) => {
    message.reply({
      content: `🏓 **Pong!** Client websocket ping: \`${client.ws.ping}\` ms.`,
    });
  },
};
