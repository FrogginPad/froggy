const {
  EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder,
} = require('discord.js');
const guild = require('../../../config/guild');

// some random shuffle algo
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

module.exports = {
  name: 'shuffle',
  description: 'shuffle teams',
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  run: async (client, interaction, config, db) => {
    const voiceChannel = await client.channels.fetch(guild.Channels.Customs.lobbyVoice);

    const users = [];

    voiceChannel.members.forEach((members) => users.push(members));

    shuffle(users);

    if (users?.length) {
      const half = 5;
      const cap = 10;
      const team1 = users.slice(0, half);
      const team2 = users.slice(half, cap);
      const extras = users.slice(cap);

      global.matchDetails = {
        team1,
        team2,
        extras,
      };

      interaction.reply({
        content: `**Team 1** \n ${team1.toString()} \n\n **Team 2** \n ${team2.toString()} \n\n **Extras** \n ${extras.toString() || '*none*'}`,
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
