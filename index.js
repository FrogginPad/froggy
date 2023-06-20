const {
  REST, Routes, Client, Partials, Collection, GatewayIntentBits,
} = require('discord.js');
const colors = require('colors');
const config = require('./config/config');
const guild = require('./config/guild');
require('dotenv').config();

const { TOKEN } = process.env;

const rest = new REST({ version: '10' }).setToken(TOKEN);

// Creating a new client:
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
  presence: {
    activities: [{
      name: 'VALORANT, probably',
      type: 0,
    }],
    status: 'online',
  },
});

// Host the bot:
require('http').createServer((req, res) => res.end('Ready.')).listen(3000);

// Getting the bot token:
if (!TOKEN) {
  console.warn('[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets.'.red);
  process.exit();
}

// Handler:
client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.message_commands = new Collection();
client.modals = new Collection();
client.events = new Collection();

module.exports = client;

['prefix', 'application_commands', 'modals', 'events', 'mongoose'].forEach((file) => {
  require(`./handlers/${file}`)(client, config);
});

// Login to the bot:
client.login(TOKEN)
  .catch((err) => {
    console.error('[CRASH] Something went wrong while connecting to your bot...');
    console.error(`[CRASH] Error from Discord API:${err}`);
    return process.exit();
  });

// Handle errors:
process.on('unhandledRejection', async (err, promise) => {
  console.error(`[ANTI-CRASH] Unhandled Rejection: ${err}`.red);
  console.error(promise);
});

// for global commands
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: [] })
  .then(() => console.log('Successfully deleted all guild commands.'))
  .catch(console.error);
