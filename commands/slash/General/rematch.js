const {
  EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder,
} = require('discord.js');

module.exports = {
  name: 'rematch',
  description: 'rematch the same teams',
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  run: async (client, interaction, config, db) => {
    if (global.matchDetails) {
      interaction.reply({
        content: `**Team 1** \n ${global.matchDetails.team1.toString()} \n\n **Team 2** \n ${global.matchDetails.team2.toString()} \n\n **Extras** \n ${global.matchDetails.extras.toString() || '*none*'}`,
        components: [
          new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId('coinflip').setLabel('Flip coin').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('startmatch').setLabel('Start match').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('endmatch').setLabel('End match').setStyle(ButtonStyle.Danger),
          ),
        ],
      });
    } else {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription('Error generating teams')
            .setColor('Red'),
        ],
        ephemeral: true,
      });
    }
  },
};
