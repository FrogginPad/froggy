# Slash

Commands that require a `/` to activate

## Usage

`/test`

### Ephemeral

Ephemeral Responses reply only to the person who sent the message

## Basic Setup

```js
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'test',
  description: 'Replies with test`,
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  run: async (client, interaction, config, db) => {
    return interaction.reply({
        content: `Test`,
    });
  },
};
```

## Basic Setup with Embeds

```js
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'test',
  description: 'Replies with test`,
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  run: async (client, interaction, config, db) => {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`test`)
          .setColor('Green'),
      ],
      ephemeral: false,
    });
  },
};
```
