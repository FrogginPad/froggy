module.exports = {
  config: {
    name: 'uptime',
    description: 'Replies with bot uptime!',
    usage: '!uptime',
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config, db) => {
    message.reply({
      content: `bot has been up for ${new Date(process.uptime() * 1000).toISOString().slice(11, 19)}s`,
    });
  },
};
