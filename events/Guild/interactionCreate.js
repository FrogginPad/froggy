const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const client = require('../../index');
const config = require('../../config/config');
const guild = require('../../config/guild');

const db = new QuickDB();

module.exports = {
  name: 'interactionCreate',
};

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    console.log(`[SLASH] ${interaction.commandName} by ${interaction.user.username}`);
    const command = client.slash_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config, db);
    } catch (e) {
      console.error(e);
    }
  }

  if (interaction.isUserContextMenuCommand()) {
    console.log(`[USER COMMAND] ${interaction.commandName} by ${interaction.user.username}`);
    const command = client.user_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config, db);
    } catch (e) {
      console.error(e);
    }
  }

  if (interaction.isMessageContextMenuCommand()) {
    console.log(`[MESSAGE CONTEXT] ${interaction.commandName} by ${interaction.user.username}`);
    const command = client.message_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config, db);
    } catch (e) {
      console.error(e);
    }
  }

  if (interaction.isModalSubmit()) {
    // Modals:
    const modal = client.modals.get(interaction.customId);

    if (!modal) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              'Something went wrong... Probably the Modal ID is not defined in the modals handler.',
            )
            .setColor('Red'),
        ],
        ephemeral: true,
      });
    }

    try {
      modal.run(client, interaction, config, db);
    } catch (e) {
      console.error(e);
    }
  }

  /* --- Selecting Rank ---
     uses /rank to pick from a list of ranks
  */
  if (interaction.customId === 'select') {
    const input = interaction.values[0];
    console.log(input);

    const usersRankID = guild.Roles.Ranks[input];
    const role = interaction.guild.roles.cache.get(usersRankID);

    await interaction.member.roles
      .add(role)
      .then((member) => interaction.reply({
        content: `you now have the ${input} role`,
        ephemeral: true,
      }));
  }

  /* --- Verifying membership ---
     uses button in #welcome channel then assigns role
  */
  if (interaction.customId === 'verify') {
    const role = interaction.guild.roles.cache.get(guild.Roles.verified);
    if (role) {
      interaction.member.roles
        .add(role)
        .then((member) => interaction.reply({
          content: `you are now a ${role}`,
          ephemeral: true,
        })
          .catch(console.log('[WARN] Role already assigned')));
    }
    console.error('There was an error getting the role');
  }

  /* --- Coinflip ---
    generates coinflip -- answers "heads" or "tails"
  */
  if (interaction.customId === 'coinflip') {
    const flip = Math.random() >= 0.5 ? 'heads' : 'tails';
    interaction.reply({
      content: `${interaction.user} flipped coin: **${flip}**`
    })
  };

  /* --- Start match ---
    uses button after shuffle to distribute teams
  */
    if (interaction.customId === 'startmatch') {

    // Assign team 1
    const team1Channel = guild.Channels.Customs.team1Voice;
    const team1Members = global.matchDetails.team1;
    team1Members && team1Members.map(member => member.voice.setChannel(team1Channel));

    // Assign team 2
    const team2Channel = guild.Channels.Customs.team2Voice;
    const team2Members = global.matchDetails.team2;
    team2Members && team2Members.map(member => member.voice.setChannel(team2Channel));

    interaction.reply({
      content: `🐸 ${interaction.user} started match`
    })
  }

    /* --- end match ---
    user button after shuffle/match to regroup all players
  */
    if (interaction.customId === 'endmatch') {

      const lobbyVoice = guild.Channels.Customs.lobbyVoice;

      // Recall team 1
      const team1Members = global.matchDetails.team1;
      team1Members && team1Members.map(member => member.voice.setChannel(lobbyVoice));
  
      // Recall team 2
      const team2Members = global.matchDetails.team2;
      team2Members && team2Members.map(member => member.voice.setChannel(lobbyVoice));
  
      interaction.reply({
        content: `😩 ${interaction.user} ended match`
      })
    }
});
