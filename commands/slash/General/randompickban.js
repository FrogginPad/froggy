const { EmbedBuilder } = require("discord.js");

function getRandomMap() {
    let randomMap = maps[Math.floor(Math.random() * maps.length)];
    maps = maps.filter(map => map !== randomMap );
    return randomMap;
}

function getRandomSide() {
    return Math.random() >= 0.5 ? "Attack" : "Defense";
}

function createMapArray() {
    maps = Array(
        'Ascent',
        'Breeze',
        'Bind',
        'Fracture',
        'Haven',
        'Icebox',
        'Pearl',
        'Split'
    );
}
createMapArray();

module.exports = {
    name: "randompickban",
    description: "Randomized pick/bans phases for a BO3",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        let banOne = getRandomMap();
        let banTwo = getRandomMap();
        let banThree = getRandomMap();
        let banFour = getRandomMap();
        let pickOne = getRandomMap();
        let pickTwo = getRandomMap();
        let pickThree = getRandomMap();
        let sideOne = getRandomSide();
        let sideTwo = getRandomSide();
        let sideThree = getRandomSide();
        
        //resetting map list
        createMapArray();

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`
                    Team A bans: ${banOne}
                    Team B bans: ${banTwo}

                    **Team A picks: ${pickOne}**
                    **Team B starts on ${sideOne}**

                    **Team B picks: ${pickTwo}**
                    **Team A starts on ${sideTwo}**

                    Team A bans: ${banThree}
                    Team B bans: ${banFour}

                    **Decider map: ${pickThree}**
                    **Team A starts on ${sideThree}**
                `)
                .setColor('Green')
            ],
            ephemeral: false
        })
    },
};
