# Setup Froggy

1. Install [Visual Studio Code](https://code.visualstudio.com/Download)
2. Install [Node.js](https://nodejs.org/en/download/) (Required: v^16.9.0)
3. Clone the project `git clone git@github.com:ryelo/froggy.git`
4. Go to `config/config.js` and change all the values:

    ```js
    module.exports = {

      Prefix: "", // Bot prefix for commands, ex) !help

      Users: {
        OWNERS: [""] // Owners
      }
    }
    ```

5. Go to `.env.example` and change all the values

    ```js
    TOKEN= // Bot token
    PUBLIC_KEY= // Public key for token
    CLIENT_ID= // Client ID for token
    GUILD_ID= // ID for discord server (enable with dev mode in discord, right click server name -> copy token)
    MONGO= // Mongo DB token if needed
    ```

6. Type in the terminal: `yarn install`
7. Type in the terminal: `yarn start`
8. [Set up the bot + permissions](https://github.com/ryelo/froggy/tree/main/docs/createBot.md)
