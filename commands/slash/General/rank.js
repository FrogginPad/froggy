const { EmbedBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js');

const ranks = [
    'immortal',
    'ascendant',
    'diamond',
    'platinum',
    'gold',
    'silver',
    'bronze',
    'iron'
];

module.exports = {
    name: "rank",
    description: "Set Rank",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {

        let formattedRanks = [];
        ranks.map(rank => {
            formattedRanks.push(
                {
                    label: `${rank}`,
                    value: `${rank}`
                }
            )
        });

        const verifyEmbed = new EmbedBuilder()
        .setTitle('Select your rank')
        .setDescription('You should receive a role based on your selection')
        .setColor('Green')

        return interaction.reply({
            embeds: ([verifyEmbed]),
            components: [
              new ActionRowBuilder()
                .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Nothing selected')
                .addOptions(formattedRanks)
                .setMinValues(1)
                .setMaxValues(1)
              )
            ],
            ephemeral: true
        });
    },
};