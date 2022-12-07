const { EmbedBuilder, GuildMember } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  execute(member) {
    const { user, guild } = member;
    const welcomeChannel = member.guild.channels.cache.get('1050068870939025489');
    const welcomeMessage = `Welcome new frog, ${member.id}`;

    const welcomeEmbed = new EmbedBuilder()
      .setTitle("New Frog")
      .setDescription(welcomeMessage)
      .setColor("Green")
      .addFields({name: 'Total members', value: `${guild.memberCount}`})
      .setTimestamp()

    welcomeChannel.send({embeds: [welcomeEmbed]});
  }
}