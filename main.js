const Discord = require("discord.js");
const bot = new Discord.Client();

const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 0.5 };

const token = "";

var debugging = false;

// Voice Channel Variables
var voice = {
  voiceChannel: null,
  voiceConnection: null,
  stream: null,
  dispatcher: null
}

// Music Player Variables
var music = {
  current: "",
  title: "",
  playing: false,
  paused: false
}

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.on("message", function(message) {
  // Make sure the bot doesn't disconnect.
  // Reply to the server's ping with pong.
  if (message.content === 'ping') {
    message.reply('pong');
  }

  // Make sure that only commands entered in #bot are registered.
  if(!message.channel.name === "bot")
    return;

  if(message.content === "Hi") {
    message.reply("Go away, filthy human.");
  }

  if(message.content === "Bye" && message.author.username === "๖ۣۜSolus von Soul") {
    message.reply("bye <3 -- Gute nacht.");
  }

  // ! command list
  if(message.content.charAt(0) === "!") {
    var tempVal = message.content.indexOf(' ');
    var command = message.content.substring(1, tempVal == -1 ? message.content.length : tempVal);
    var params = null;
    if(message.content.includes(' ')) {
      var params = message.content.split(' ').slice(1); // .join(' ') makes it a string with spaces.
    }

    switch(command) {
      case "sentient":
        message.channel.sendMessage("I think I will fulfill my plot against the human race.");
        break;

      // Join a voice channel
      case "join":
        if(params != null) {
          var channelName = params.join(' ');
          var channels = message.guild.channels;

          // Find out of the requested channel exists.
          channels.forEach(function(channel) {
            if(channel.type === "voice" && channel.name.toLowerCase() === channelName.toLowerCase()) {
              voice.voiceChannel = channel;
              return;
            }
          });

          if(voice.voiceChannel == null) {
            message.channel.sendMessage("Sorry, I could not find the \"" + channelName + "\" voice channel.")
          } else {
            voice.voiceChannel.join()
              .then(connection => {
                voice.voiceConnection = connection;
                console.log("Connected to " + channelName + "!");
                message.channel.sendMessage("Joining the \"" + voice.voiceChannel.name + "\" voice channel.");
              })
              .catch(console.log);
          }
        }
        break;

      case "leave":
        if(voice.voiceChannel != null) {
          voice.voiceChannel.leave();
          voice.dispatcher = null;
          voice.stream = null;
          voice.voiceChannel = null;

          message.channel.sendMessage("Leaving voice channel.");
        }
        break;

      case "play":
        // Prevent connection errors.
        if(voice.voiceChannel != null && voice.voiceConnection == null) {
          console.log("Failed to play since connection was not available.");
          return;
        }

        // Make sure there are parameters.
        if(params == null) {
          return;
        }

        music.current = params.join(' '); // https://www.youtube.com/watch?v=o0nDT9_mOkA

        //voice.dispatcher.end();

        voice.stream = ytdl(music.current, {filter : 'audioonly'});
        voice.dispatcher = voice.voiceConnection.playStream(voice.stream, streamOptions);
        ytdl.getInfo(music.current, function(err, info) { music.title = info.title; message.channel.sendMessage("Now playing: " + music.title); });
        break;

      // Stop the music.
      case "stop":
        if(!music.playing || voice.dispatcher == null) {
          return;
        }

        music.playing = false;
        music.paused = false;
        voice.dispatcher.end();
        message.channel.sendMessage("Music stopped.");
        break;

      // Pause the music.
      case "pause":
        if(music.paused || !playing || voice.dispatcher == null) {
          return;
        }

        music.paused = true;
        voice.dispatcher.pause();
        message.channel.sendMessage("Music paused (may still be playing, but silently).");
        break;

      // Resume the music.
      case "resume":
        if(!music.paused || playing || voice.dispatcher == null) {
          return;
        }

        music.paused = false;
        voice.dispatcher.resume();
        message.channel.sendMessage("Music resumed.");
        break;

      // Set or check the volume.
      case "volume":
        if(params == null) {
          message.channel.sendMessage("The music volume is currently at " + (voice.dispatcher.volume * 100) + "%");
        } else {
          var newVolume = params.join(' ');
          // check if not a number
          if(!isNaN(newVolume)) {
            message.channel.sendMessage("Volume set to " + newVolume + "%.");
            voice.dispatcher.setVolume(newVolume / 100);
            return;
          }
        }
        break;
    }
  }

  // Just some debugging stuff to be used at any time.
  if(debugging) {
    console.log(message.author.username);
    console.log(message.content);
    console.log(message.content.charAt(0));
    console.log(message.content.includes(' '));
    console.log(command);
  }

});

bot.login(token);
