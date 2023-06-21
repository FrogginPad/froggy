# Message

Replies

## Basic Setup

```js
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'test',
  type: 3,
  run: async (client, interaction, config, db) => interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setDescription('Test'),
    ],
    ephemeral: true,
  }),
};
```
