const { EmbedBuilder } = require('discord.js');
const guild = require('../../../config/guild');

module.exports = {
  name: 'delete', // Name of command
  description: 'delete an event', // Command description
  type: 1, // Command type
  options: [
    {
      name: 'id',
      description: 'ID for event',
      type: 3,
      required: true,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  run: async (client, interaction, config, db) => {
    const { options } = interaction;
    const inputs = options._hoistedOptions;
    const id = inputs[0].value;
    const channel = client.channels.cache.get(guild.Channels.general); // always send it to the general for now

    const deletedEmbed = new EmbedBuilder()
      .setTitle('Event deleted')
      .setColor('Red');

    channel.messages.fetch(id)
      .then((message) => message.delete() && channel.send({ embeds: [deletedEmbed], ephemeral: true }))
      .catch(console.error);
  },
};
