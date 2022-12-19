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

function getUnixDate(date) {
  return Sugar.Date.format(new Date(date), '{X}');
}

module.exports = {
  name: 'event',
  description: 'schedule an event',
  type: 1,
  options: [
    {
      name: 'description',
      description: 'Description of event',
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
    const channel = client.channels.cache.get(guild.Channels.general); // always send it to the general for now

    const readableDate = getReadableDate(inputs[1].value);

    if (readableDate) {
      const unixDate = getUnixDate(readableDate);
      const reminderDate = Sugar.Date.rewind(new Date(readableDate), '10 minutes');
      const msTillDate = Math.abs(Sugar.Date.millisecondsUntil(reminderDate)); // No idea why this is negative, but flip it

      const description = `${inputs[0].value} \n\n **Date**: <t:${unixDate}:F> \n\n Event starts <t:${unixDate}:R>`;
      const embed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(description);

      let reacted = [];

      try {
        const message = await channel.send({ embeds: [embed] });
        await message.react('✅');
        await message.react('❌');
        await interaction.reply({ content: 'Event scheduled', ephemeral: true });

        const filter = (reaction, user) => reaction.emoji.name === '✅';

        const collector = message.createReactionCollector({ filter, time: msTillDate });

        collector.on('collect', (reaction, user) => {
          reacted.push(`${user}`);
        });

        collector.on('end', (collected) => {
          if (reacted.length) {
            console.log(`Event collection completed, logged ${reacted.toString()}`);
            const reminderEmbed = new EmbedBuilder()
              .setTitle('Reminder!')
              .setDescription('Event starts in 10 minutes')
              .setColor('Green');
            channel.send({ content: reacted.toString(), embeds: [reminderEmbed] });
            reacted = [];
          }
          reacted = []; // reset reacted list, if the event is deleted, users could remain in queue
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription('There was an error with your date, please try again')
            .setColor('Red'),
        ],
        ephemeral: true,
      });
    }
  },
};
