const { EmbedBuilder } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config.js");
const guild = require("../../config/guild.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "interactionCreate",
};

client.on("interactionCreate", async (interaction) => {

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

    if (!modal)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "Something went wrong... Probably the Modal ID is not defined in the modals handler."
            )
            .setColor("Red"),
        ],
        ephemeral: true,
      });

    try {
      modal.run(client, interaction, config, db);
    } catch (e) {
      console.error(e);
    }
  }

  /* --- Selecting Rank ---
     uses /rank to pick from a list of ranks
  */
  if (interaction.customId === 'rankSelect') {

    const input = interaction.values[0];

    const usersRankID = guild.Roles.Ranks[input];
    const role = interaction.guild.roles.cache.get(usersRankID);

    await interaction.member.roles
    .add(role)
    .then((member) =>
      interaction.reply({
        content: `you now have the ${input} role`,
        ephemeral: true
      })
    )
  }

  /* --- Verifying membership ---
     uses button in #welcome channel then assigns role
  */
  if (interaction.customId === 'verify') {
    const role = interaction.guild.roles.cache.get(guild.Roles.verified);
    if(role) {
      return interaction.member.roles
        .add(role)
        .then((member) =>
          interaction.reply({
            content: `you are now a ${role}`,
            ephemeral: true
          })
        .catch(console.log('[WARN] Role already assigned'))
        );
      } else {
        console.error('There was an error getting the role')
        return;
      }
    }
});
