const {
  EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits,
} = require('discord.js');
const guild = require('../../../config/guild');

module.exports = {
  name: 'resetrank',
  description: 'Reset your ranks',
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  run: async (client, interaction, db) => {
    Object.values(guild.Roles.Ranks).map((rank) => interaction.member.roles.remove(rank));
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
