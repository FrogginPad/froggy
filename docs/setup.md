# Setup Froggy

1. Install [Visual Studio Code](https://code.visualstudio.com/Download)
2. Install [Node.js](https://nodejs.org/en/download/) (Required: v^16.9.0)
3. Clone
  a. this project `git clone git@github.com:FrogginPad/froggy.git`
  b. tadpole (api) `git clone git@github.com:FrogginPad/tadpole.git`
4. [Set up the bot + permissions](https://github.com/FrogginPad/froggy/tree/main/docs/createBot.md)
5. Go to `config/guild.example.js` and change all the values and rename to `guild.js` (keep file inside `config` directory)

    ```js
    module.exports = {

      Channels: {
        welcome: '' // #WELCOME in template
      },

      Roles: {
        verified: '' // Verified role, @frog in template
      }

      Prefix: "", // Bot prefix for commands, ex) !

      Users: {
        OWNERS: [""] // Owners
      }
    }
    ```

6. Go to `.env.example` and change all the values and rename to `.env`

    ```js
    TOKEN= // Bot token
    PUBLIC_KEY= // Public key for token
    CLIENT_ID= // Client ID for token
    GUILD_ID= // ID for discord server (enable with dev mode in discord, right click server name -> copy token)
    MONGO= // Mongo DB token if needed
    API_URL= // Local version of Froggy's API (tadpole)
    ```

7. For both froggy and tadpole in two terminals: `npm install`
8. For both froggy and tadpole in two terminals `npm start`
9. Run a command `!status` in your discord server
