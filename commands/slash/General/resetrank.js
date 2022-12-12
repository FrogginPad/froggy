const {
  EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits,
} = require('discord.js');
const guild = require('../../../config/guild.js');

module.exports = {
  name: 'resetrank',
  description: 'Reset your ranks',
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  run: async (client, interaction, db) => {
    for (const rank in guild.Roles.Ranks) {
      interaction.member.roles
        .remove(guild.Roles.Ranks[rank]);
    }
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription('Your rank has been reset')
          .setColor('Green'),
      ],
      ephemeral: true,
    });
  },
};
