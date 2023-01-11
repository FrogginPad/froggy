const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'coinflip',
  description: 'Replies with heads or tails',
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  run: async (client, interaction, config, db) => {
    const flip = Math.random() >= 0.5 ? 'heads' : 'tails';
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`${flip}`)
          .setColor('Green'),
      ],
      ephemeral: false,
    });
  },
};
