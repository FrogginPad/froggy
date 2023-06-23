const coinflip = require('../../../functions/coinflip');
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

    const res = await coinflip();

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`${res.data.flip}`)
          .setColor('Green'),
      ],
      ephemeral: false,
    });
  },
};
