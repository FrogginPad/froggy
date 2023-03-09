const {
  EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits,
} = require('discord.js');
const guild = require('../../../config/guild');

const VERIFICATION_MESSAGE = '💚 Enter the palace 💚';

module.exports = {
  name: 'verify',
  description: 'Start verification',
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.Administrator,
  },
  run: async (client, interaction, db) => {
    const channel = client.channels.cache.get(guild.Channels.Enter.welcome);
    const verifyEmbed = new EmbedBuilder()
      .setTitle('Verification')
      .setDescription('Click the button to verify your account')
      .setColor('Green');
    const sendChannel = channel.send({
      embed: ([verifyEmbed]),
      components: [
        new ActionRowBuilder().setComponents(
          new ButtonBuilder().setCustomId('verify').setLabel(VERIFICATION_MESSAGE).setStyle(ButtonStyle.Success),
        ),
      ],
    });
    if (!sendChannel) {
      return interaction.reply({ content: 'There was an error, try again later', epemeral: true });
    }
    return interaction.reply({ content: 'Verification was successfully set', epemeral: true });
  },
};
