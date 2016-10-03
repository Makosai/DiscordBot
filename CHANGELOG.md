###### Current Version: v0.0.2a

## Test Matrix for Current Version Before Release
---
`{added} = added and needs testing; {good} = tested and works; {bad} = bugged needs fixing; {} = not added.`
- !volume {added}: Maximum volume set to 200%.
- !_volume {added}: Has no maximum volume but doesn't save the volume.
- !playlist {added}: Display all playlists if any.
- !playlist add {added}: Add a playlist. Or add a link to a playlist if it exists.
- !playlist remove {}: Remove a playlist if it's not locked. Or remove a link from a playlist if it exists.
- !playlist play {}: Play a playlist from the beginning. Or play it from a specified song index.
- !playlist playtrack {}: This may be added if I can't find a way to get the track number from !playlist play.
- !playlist show {added}: Show all songs in a playlist if it exists.

## Changelog
---

#### **_10/3/2016 - v0.0.2a_**
 
__\*\* Changes \*\*__
Coming soon...

__\*\* Fixes \*\*__
- Multiple !playlist commands now work.
- !playlist create now actually creates a playlist.
- add now actually adds a playlist to a playlist.
- add actually checks if the playlist exists.
- When running most playlist commands, the bot will tell you if it failed or did it successfully.
- stop actually stops the playlist but doesn't stop the music (see todo).

__\*\* Todo \*\*__
- create command should be reviewed for any possible bugs.
- create shouldn't make duplicate playlists.
- rename command should be created.
- all ytdl.getInfo() calls should handle errors incase the link is not valid (if info != null maybe?).
- UPDATE TODO AND TEST MATRIX AND FIXES SECTION AND HELP COMMAND.
- stop command should stop the music and not just the playlist.


#### **_9/29/2016 - v0.0.1a_**
 
__\*\* Fixes \*\*__
- Fixed a minor bug with the !volume command.
	~ "Users were able to type in !volume 9001. If you went away for a while and came back then the bot would resume the next song at the same volume. Fun? Not! Lol. Thank Brahmahdawg for this change."

__\*\* Added \*\*__
- Added a !_volume command.
	~ "To let people still have their silly freedom, I made a !_volume command. You can enter any volume number you want. The difference is that it won't save it. The next time you type !play is when the volume will be overwritten with the previously saved volume."

- Added a batch file to easily run the bot on Windows.
	~ "It's not required. Just saves me a lot of time when I want to test it on my local PC and not Linux. This way I don't have to always go to the directory when I first start testing. All it does is switch to the directory and open the main.js file with NodeJS."

__\*\* Removed \*\*__
- !sentient is no longer a command.
	~ "Solus said it was stupid. :("