const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js');

const roleIDs = {
  'immortal': '1050440241783250944',
  'ascendant': '1050454583677304832',
  'diamond': '1050440163098120263',
  'platinum': '1050440077433655407',
  'gold': '1050440038665699328',
  'silver': '1050439366637539348',
  'bronze': '1050439271640739881',
  'iron': '1050439366637539348'
};

module.exports = {
  name: 'resetrank',
  description: 'Reset your ranks',
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
  },
  run: async (client, interaction, config, db) => {
    for(const rank in roleIDs) {
      interaction.member.roles
      .remove(roleIDs[rank])
    }
    return interaction.reply({
      embeds: [
          new EmbedBuilder()
              .setDescription("Ranks reset")
              .setColor('Green')
      ],
      ephemeral: true
    })
  }
}
