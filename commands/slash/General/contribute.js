const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "contribute",
    description: "Make me better",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        const flip = Math.random() >= 0.5 ? "heads" : "tails";
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Make me better please :-) https://github.com/ryelo/froggy`)
                    .setColor('Green')
            ],
            ephemeral: false
        })
    },
};
