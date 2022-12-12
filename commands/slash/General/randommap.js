const { EmbedBuilder } = require('discord.js');
const consts = require('../../consts/consts');

module.exports = {
  name: 'randommap',
  description: 'Random map picker',
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  run: async (client, interaction, config, db) => {
    const map = consts.MAPS[Math.floor(Math.random() * consts.MAPS.length)];
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Your map pick: ${map}`)
          .setColor('Green'),
      ],
      ephemeral: false,
    });
  },
};
