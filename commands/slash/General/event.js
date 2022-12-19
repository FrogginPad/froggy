const { EmbedBuilder } = require('discord.js');
const Sugar = require('sugar');
const guild = require('../../../config/guild');

function getReadableDate(date) {
  const readableDate = Sugar.Date.create(date);

  if (Sugar.Date.isValid(new Date(readableDate))) {
    return readableDate;
  }
  return false;
}

const eventsBaseURL = 'https://discord.com/events';

module.exports = {
  name: 'event',
  description: 'schedule an event',
  type: 1,
  options: [
    {
      name: 'name',
      description: 'Name of event',
      type: 3,
      required: true,
    },
    {
      name: 'description',
      description: 'description of event',
      type: 3,
      required: true,
    },
    {
      name: 'when',
      description: 'What day do you want to schedule this event? ex) today at 8pm OR this friday at 10pm',
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
    const channel = await client.channels.cache.get(guild.Channels.customsVoice); // always send it to the general for now

    const name = inputs[0].value;
    const description = inputs[1].value;
    const readableDate = getReadableDate(inputs[2].value);

    const event = await interaction.guild.scheduledEvents.create({
      name,
      description,
      scheduledStartTime: readableDate,
      privacyLevel: 2,
      entityType: 2,
      channel,
    });

    console.log(event);

    interaction.reply({
      content: `${eventsBaseURL}/${event.guildId}/${event.id}`,
      embeds: [
        new EmbedBuilder()
          .setDescription('Event scheduled')
          .setColor('Green'),
      ],
    });
  },
};
