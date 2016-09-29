const Discord = require("discord.js");
const bot = new Discord.Client();

const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 0.5 };
const maxVolume = 200;

const fs = require('fs');

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

var playlists = [];
/* playlist layout
name: "",
songs: [{
  name: "",
  link: ""
}],
locked: true // Whether or not the playlist is deletable.
}
*/

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
  if(!(message.channel.name === "bot"))
    return;

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
          if(voice.dispatcher != null)
            message.channel.sendMessage("The music volume is currently at " + (voice.dispatcher.volume * 100) + "%");
          else
            message.channel.sendMessage("The music volume is currently at " + (streamOptions.volume * 100) + "%");
        } else {
          var newVolume = params.join(' ');
          // check if not a number
          if(!isNaN(newVolume)) {
            if(newVolume > maxVolume) {
              message.channel.sendMessage("Sorry, I can't do that. The maximum volume is " + maxVolume + "%.");
              return;
            }
            message.channel.sendMessage("Volume set to " + newVolume + "%.");
            streamOptions.volume = (newVolume / 100);
            if(voice.dispatcher != null)
              voice.dispatcher.setVolume(newVolume / 100);
          }
        }
        break;

        // Set or check the volume without a limit.
        case "_volume":
          if(params == null) {
            if(voice.dispatcher != null)
              message.channel.sendMessage("The music volume is currently at " + (voice.dispatcher.volume * 100) + "%");
            else
              message.channel.sendMessage("The music volume is currently at " + (streamOptions.volume * 100) + "%");
          } else {
            var newVolume = params.join(' ');
            // check if not a number
            if(!isNaN(newVolume)) {
              message.channel.sendMessage("Volume set to " + newVolume + "%.");
              streamOptions.volume = (newVolume / 100);
              if(voice.dispatcher != null)
                voice.dispatcher.setVolume(newVolume / 100);
              return;
            }
          }
          break;

      case "playlist":
        if(params == null) {
          var allPlaylists = "";

          // Determine if there is anything in the playlists array.
          if(playlists.length < 1) {
            message.channel.sendMessage("There are no playlists currently.");
            return;
          }

          // Display all of the playlists entered.
          var trackNum = 1;
          playlists.forEach(function(playlist) {
             allPlaylists += "- " + playlist.name + " (" + playlist.songs.length + " Songs)\n";
          });

          message.channel.sendMessage(allPlaylists);
          return;
        }

        // Make sure there's at least 1 parameter present.
        // Not sure why I did params[1], I'm sleepy so I can't really understand it nor do I feel like understanding it. 8:11 AM.
        if(params[0] == null || params[1] == null) {
          return;
        }

        switch(params[0]) {
          // !playlist create <playlist name>
          case "create":
            var newList = {
              name: "",
              songs: [],
              locked: true // Whether or not the playlist is deletable.
            }

            newList.name = params.substring(params[0].length);
            playlists.push(newList);
            break;

          // !playlist add <playlist name> <link>
          case "add":
            var playlistName = params.myJoin(" ", 1, params.length - 1);
            playlists.forEach(function(playlist) {
              if(playlist.name == playlistName) {
                var songName = "";
                var songLink = params[params.length - 1];
                ytdl.getInfo(songLink, function(err, info) { songName = info.title; });
                var song = {
                  name: songName,
                  link: songLink
                };
              } else {
                message.channel.sendMessage("Sorry, that playlist doesn't exist. Try again.");
              }
            });
            break;

          // !playlist remove <playlist name> [link]
          case "remove":
            break;

          // !playlist play <playlist name> [track number]
          case "play":
            var playlistName = params.myJoin(" ", 1, params.length - 1);

            // Not sure how I'm going to differentiate track from playlist lol... didn't think it through.
            //Because what if the playlist ends with a number. I also don't want to force them to use quotations.
            //Track numbers are optional. I might have to made a separate case. !playlist playtrack maybe?
            var trackNum = params[params.length - 1];
            break;

          // !playlist show <playlist name>
          case "show":
            var playlistName = params.myJoin(" ", 1, params.length - 1);

            playlists.forEach(function(playlist) {
              if(playlist.name == playlistName) {
                allPlaylists += "- " + playlist.name + " (" + playlist.songs.length + " Songs)\n";

                playlist.songs.forEach(function(song) {
                  allPlaylists += "    * " + song.name + "(" + song.link + ")\n";
                });
              }
            });

            break;
        }
        break;

      case "help":
        message.channel.sendMessage("\
          <> = required, [] = optional, | = or.\n\
          \n\n\
          !join <voice channel>\n\
          !leave\n\
          !play <Youtube Video | Youtube Playlist>\n\
          !stop\n\
          !pause\n\
          !resume\n\
          !volume [volume (number only) out of 100]\
        ");
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

function save(item) {
  switch(item) {
    case "playlist":
      fs.writeFile(
        './playlists.json',
        JSON.stringify(playlists),
        function (err) {
          if (err) {
            console.error('Error saving the file.');
          }
        }
      );
      break;
  }
}

// Essential Functions

// http://stackoverflow.com/questions/10342728/join-array-from-startindex-to-endindex
Array.prototype.myJoin = function(seperator,start,end) {
    if(!start) start = 0;
    if(!end) end = this.length - 1;
    end++;
    return this.slice(start,end).join(seperator);
};

bot.login(token);
