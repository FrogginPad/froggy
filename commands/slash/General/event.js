const { EmbedBuilder } = require('discord.js');
const Sugar = require('sugar');
const guild = require('../../../config/guild');

function getReadableDate(date) {
  const readableDate =  Sugar.Date.create(date);

  if(Sugar.Date.isValid(new Date(readableDate))) {
    return readableDate;
  } else {
    return false;
  }
}

function getUnixDate(date) {
  return Sugar.Date.format(new Date(date), '{X}');
}

module.exports = {
    name: "event",
    description: "schedule an event",
    type: 1,
    options: [
        {
          name: 'description',
          description: 'Description of event',
          type: 3,
          required: true
        },
        {
          name: 'when',
          description: 'What day do you want to schedule this event? ex) today at 8pm OR this friday at 10pm',
          type: 3,
          required: true
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

        console.log(readableDate);
        
        if(readableDate) {
          const unixDate = getUnixDate(readableDate);

          const description = `${inputs[0].value} \n\n **Date**: <t:${unixDate}:F> \n\n Event starts in <t:${unixDate}:R>`;
          const embed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(description)
          
          try {
            const m = await channel.send({ embeds: [embed] });
            await m.react('✅');
            await m.react('❌');
            await interaction.reply({content: 'Event scheduled', ephemeral: true});
          } catch(err) {
            console.log(err);
          }
        } else {
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`There was an error with your date, please try again`)
                .setColor('Red'),
            ],
            ephemeral: true,
          });
        }
    },
};