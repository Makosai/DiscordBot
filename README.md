# QuaintBot - The Discord Bot
A DiscordBot made with Discord.js in NodeJS.

## Notice
##### Bugs
There are some bugs. It's nothing major. It just happens when you do things in an incorrect order. Like trying to run !play when you haven't run !join yet. Which I might have fixed before it was even a problem. Just know that I handled the majority of the major problems I'll get around to fixing it sometime in the future when Jake decides he doesn't like it.

##### Updates being worked on
Playlist support & Soundcloud support! That's all, folks!

## Installation
* **All requiresments**: `npm install discord.js node-opus ytdl-core fs --save`
* **Discord.js** (*Node.js 6.0.0 or newer is required*): ([node-opus](https://www.npmjs.com/package/node-opus)) `npm install discord.js node-opus --save`
* **ytdl-core**: `npm install ytdl-core`
* **fs**: `npm install fs`

## Running
* **Creating a bot**: Go to https://discordapp.com/developers/applications/me and create a new application.
* **Sending the bot to a channel**: Place your client id from your bot's application (make sure you click create bot user) in this link -- https://discordapp.com/oauth2/authorize?client_id=PUT_CLIENT_ID_HERE&scope=bot
* **Running the bot**: `node main.js` or just click the DiscordBot.bat file on Windows.