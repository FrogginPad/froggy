# Prefix

These are commands that require some kind of prefix set in the `admin/set-prefix.js` file

The default prefix is `!`

## Usage

`!test`

## Basic Setup

```js
const { EmbedBuilder } = require('discord.js');

module.exports = {
  config: {
    name: 'test',
    description: 'Replies with test!',
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config, db) => {
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Test`)
          .setColor('Green'),
      ],
    });
  },
};
```
