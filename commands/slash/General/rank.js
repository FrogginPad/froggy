const { EmbedBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js');

// TODO assign roles based on ranks

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

        let distributedRanks = [];
        let n = 3;
        let base = 0;
        const createRanks = ranks.map(rank => {
            while(n > base) {
                distributedRanks.push(
                    {
                        label: `${rank} ${n}`,
                        value: `${rank}${n}`
                    }
                )
                n--;
            }
            n=3;
        });

        const verifyEmbed = new EmbedBuilder()
        .setTitle('Rank')
        .setDescription('Set rank')
        .setColor('Green')

        return interaction.reply({
            embeds: ([verifyEmbed]),
            components: [
              new ActionRowBuilder()
                .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Nothing selected')
                .addOptions(distributedRanks),
              )
            ],
            ephemeral: true
        });
    },
};