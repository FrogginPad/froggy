const { EmbedBuilder } = require('discord.js');
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
    const voiceChannel = await client.channels.cache.get(guild.Channels.customsVoice);
    const textChannel = await client.channels.cache.get(guild.Channels.customsText);

    let users = []

    voiceChannel.members.forEach((members) => users.push(members));

    shuffle(users);

    if(users.length) {
      const half = Math.ceil(users.length / 2); 
      textChannel.send({ content: `**Team 1** \n ${users.slice(0, half).toString()} \n\n **Team 2** \n ${users.slice(half)}`  });
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription('Generating teams')
            .setColor('Green'),
        ],
        ephemeral: true,
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
