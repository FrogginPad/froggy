const { EmbedBuilder } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "interactionCreate",
};

client.on("interactionCreate", async (interaction) => {

  console.log(`[LOG] ${interaction.commandName} by ${interaction.user.username}`);

  if (interaction.isChatInputCommand()) {
    const command = client.slash_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config, db);
    } catch (e) {
      console.error(e);
    }
  }

  if (interaction.isUserContextMenuCommand()) {
    // User:
    const command = client.user_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config, db);
    } catch (e) {
      console.error(e);
    }
  }

  if (interaction.isMessageContextMenuCommand()) {
    // Message:
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

  if (interaction.isStringSelectMenu()) {

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

    const input = interaction.values[0];

    const usersRankID = roleIDs[input];
    const role = interaction.guild.roles.cache.get(usersRankID);

    await interaction.member.roles
    .add(role)
    .then((member) =>
      interaction.reply({
        content: `you have ${input} role`,
        ephemeral: true
      })
    )
  }

  if (interaction.isButton()) {
    const role = interaction.guild.roles.cache.get("1049082583813738696");
    return interaction.member.roles
      .add(role)
      .then((member) =>
        interaction.reply({
          content: `you are now a ${role}`,
          ephemeral: true
        })
      );
  } else {
    return;
  }

});
