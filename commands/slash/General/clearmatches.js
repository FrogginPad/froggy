const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'clearmatches',
  description: 'Clears the matches channel',
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  run: async (client, interaction, config, db) => {
    const channel = client.channels.cache.get(guild.Channels.OnlyFrogs.matchesText);
    const messageManager = channel.messages;
    const messages = await messageManager.channel.messages.fetch({ limit: 100 });
    channel.bulkDelete(messages, true);
  
    return interaction.reply({
      content: 'Cleared!',
      ephemeral: true
    });
  },
};
