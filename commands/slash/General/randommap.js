const { EmbedBuilder } = require('discord.js');
const randommap = require('../../../functions/randommap');


module.exports = {
  name: 'randommap',
  description: 'Random map picker',
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  run: async (client, interaction, config, db) => {
    const res = await randommap();

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`${res.data.rotation}`)
          .setColor('Green'),
      ],
      ephemeral: false,
    });
  },
};
