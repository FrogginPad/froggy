const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js');

const VERIFICATION_MESSAGE = '💚 Enter the palace 💚';
const WELCOME_CHANNEL_ID = '1049082735739805706';

module.exports = {
  name: 'verify',
  description: 'Start verification',
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.Administrator
  },
  run: async (client, interaction, config, db) => {
    const channel = client.channels.cache.get(WELCOME_CHANNEL_ID);
    const verifyEmbed = new EmbedBuilder()
    .setTitle('Verification')
    .setDescription('Click the button to verify your account')
    .setColor('Green')
    let sendChannel = channel.send({
      embed: ([verifyEmbed]),
      components: [
        new ActionRowBuilder().setComponents(
          new ButtonBuilder().setCustomId('verify').setLabel(VERIFICATION_MESSAGE).setStyle(ButtonStyle.Success)
        )
      ]
    });
    if (!sendChannel) {
      return interaction.reply({ content: 'There was an error, try again later', epemeral: true});
    } else {
      return interaction.reply({ content: 'Verification was successfully set', epemeral: true});
    }
  }
}
