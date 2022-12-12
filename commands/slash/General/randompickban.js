const { EmbedBuilder } = require('discord.js');
const consts = require('../../consts/consts');


function getRandomMap(maps) {
  const randomMap = maps[Math.floor(Math.random() * maps.length)];
  return randomMap;
}

function getRandomSide() {
  return Math.random() >= 0.5 ? 'Attack' : 'Defense';
}

module.exports = {
  name: 'randompickban',
  description: 'Randomized pick/bans phases for a BO3',
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  run: async (client, interaction, config, db) => {
    let editableMaps = consts.MAPS;
    const teams = 2;
    const rounds = 3;
    const game = {
      maps: [],
      sides: [],
    };

    // pick sides, doesn't really need to do after map because it's random and doesn't use maps array
    [...Array(rounds).keys()].map((i) => game.sides.push(getRandomSide()));

    // get 7 maps
    [...Array(teams * rounds + 1).keys()].map((i) => {
      const selection = getRandomMap(editableMaps);
      game.maps.push(selection);
      editableMaps = editableMaps.filter((map) => map !== selection);
    });

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`
                    === Round 1 ===
                    Team A bans: ${game.maps[0]}
                    Team B bans: ${game.maps[1]}

                    **Team A picks: ${game.maps[2]}**
                    **Team B starts on ${game.sides[0]}**

                    === Round 2 ===
                    **Team B picks: ${game.maps[3]}**
                    **Team A starts on ${game.sides[1]}**

                    === Decider ===
                    Team A bans: ${game.maps[4]}
                    Team B bans: ${game.maps[5]}

                    **Decider map: ${game.maps[6]}**
                    **Team A starts on ${game.sides[2]}**
                `)
          .setColor('Green'),
      ],
      ephemeral: false,
    });
  },
};
