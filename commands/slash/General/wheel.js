const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'wheel',
  description: 'Figure out who is playing',
  type: 1,
  options: [
    {
      name: 'who',
      description: 'Who are we wheelin',
      type: 3,
      required: true,
    },
    {
      name: 'players',
      description: 'how many players are being eliminated',
      type: 3,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  run: async (client, interaction, config, db) => {
    const { options } = interaction;
    const whoInput = options._hoistedOptions[0].value;
    const formattedWho = whoInput.replace(/\s+/g, '');
    const who = formattedWho.match(/<((@!?\d+)|(:.+?:\d+))>/g);

    // Durstenfeld shuffle (thanks stackoverflow)
    const shuffle = ([...arr]) => {
      let m = arr.length;
      while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
      }
      return arr;
    };

    const shuffled = shuffle(who);

    const playersInput = Number(options?._hoistedOptions[1]?.value) || 1;

    const eliminated = shuffled.slice(0, playersInput);

    console.log(eliminated);

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Eliminated ${eliminated.toString()}`)
          .setColor('Green'),
      ],
    });
  },
};
