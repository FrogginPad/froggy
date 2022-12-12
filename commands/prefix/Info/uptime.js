const { EmbedBuilder } = require('discord.js');

module.exports = {
  config: {
    name: 'uptime',
    description: 'Replies with bot uptime!',
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config, db) => {
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`bot has been up for ${new Date(process.uptime() * 1000).toISOString().slice(11, 19)}s`)
          .setColor('Green'),
      ],
    });
  },
};
