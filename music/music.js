/*****************************************************************************
__/\\\\\\\\\\\\\\\__/\\\\\\\\\\\_____/\\\\\\\\\\\\__/\\\\\\\\\\\\\\\_        
 _\////////////\\\__\/////\\\///____/\\\//////////__\/\\\///////////__       
  ___________/\\\/_______\/\\\______/\\\_____________\/\\\_____________      
   _________/\\\/_________\/\\\_____\/\\\____/\\\\\\\_\/\\\\\\\\\\\_____     
    _______/\\\/___________\/\\\_____\/\\\___\/////\\\_\/\\\///////______    
     _____/\\\/_____________\/\\\_____\/\\\_______\/\\\_\/\\\_____________   
      ___/\\\/_______________\/\\\_____\/\\\_______\/\\\_\/\\\_____________  
       __/\\\\\\\\\\\\\\\__/\\\\\\\\\\\_\//\\\\\\\\\\\\/__\/\\\\\\\\\\\\\\\_ 
        _\///////////////__\///////////___\////////////____\///////////////__
*****************************************************************************/

const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const { bot } = require("../bot");
const error = require("../utils/error");
const Guild = require("../models/guild");
const config = require("../config.json");
const voice = require("@discordjs/voice");
const LMessages = require(`../messages/`);
const template = require("string-placeholder");

let queue = new Map();

function wait(time) {
  return new Promise((resolve) => setTimeout(resolve, time).unref());
}

bot.on("ready", () => {
  console.log(" ");
  console.log("MusicBot - Hraju!");
  callLoop();
});

const play = async (guild, song, errored) => {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    Guild.findOneAndUpdate(
      {
        guildID: guild.id,
      },
      {
        musicBotPlaying: false,
      },
      function (err) {
        if (err) {
          console.error(err);
          error.sendError(err);
          return;
        }
      }
    );
    return;
  }
  Guild.findOne(
    {
      guildID: guild.id,
    },
    (err, Gres) => {
      if (err) {
        console.error(err);
        error.sendError(err);
        return;
      }
      if (!errored) {
        if (song.seek == null) {
          if (Gres.annouce == 1) {
            const Embed = new Discord.MessageEmbed()
              .setColor(config.colors.red)
              .setTitle(LMessages.musicNowPlaying)
              .setThumbnail(song.thumbnail)
              .addFields(
                {
                  name: LMessages.musicName,
                  value: `[${song.title}](${song.url})`,
                },
                {
                  name: LMessages.musicAuthor,
                  value: song.author,
                },
                {
                  name: LMessages.musicDuration,
                  value: song.duration,
                }
              );
            if (bot.channels.cache.get(Gres.musicBotTxtChannelID)) {
              if (guild.me.permissions.has("EMBED_LINKS")) {
                bot.channels
                  .fetch(Gres.musicBotTxtChannelID)
                  .then((channel) => {
                    channel.send({ embeds: [Embed] });
                  });
              } else {
                bot.channels
                  .fetch(Gres.musicBotTxtChannelID)
                  .then((channel) => {
                    channel.send(
                      "**" +
                        LMessages.musicNowPlaying +
                        "** " +
                        "`" +
                        song.title +
                        "` **`(" +
                        song.duration +
                        ")`**"
                    );
                  });
              }
            }
          } else if (Gres.annouce == 0) {
            return;
          } else if (Gres.annouce == 3) {
            bot.channels.fetch(Gres.musicBotTxtChannelID).then((channel) => {
              channel.send(
                "**" +
                  LMessages.musicNowPlaying +
                  "** " +
                  "`" +
                  song.title +
                  "` **`(" +
                  song.duration +
                  ")`**"
              );
            });
          }
        }
      }
    }
  );

  if (!serverQueue.audioPlayer) {
    serverQueue.audioPlayer = voice.createAudioPlayer();

    serverQueue.audioPlayer.on("stateChange", (oldState, newState) => {
      if (
        newState.status === voice.AudioPlayerStatus.Idle &&
        oldState.status !== voice.AudioPlayerStatus.Idle
      ) {
        //  on finish
        Guild.findOneAndUpdate(
          {
            guildID: guild.id,
          },
          {
            musicBotSkipVotedMembersID: [],
            musicBotSkipVotesNeeded: 0,
          },
          function (err) {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }
          }
        );

        Guild.findOne(
          {
            guildID: guild.id,
          },
          (err, Gres) => {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }
            if (!Gres.musicBotLoop) {
              if (Gres.musicBotQueueLoop) {
                serverQueue.songs.push(serverQueue.songs.shift());
              } else {
                serverQueue.songs.shift();
              }
            }
            play(guild, serverQueue.songs[0], false);
            return;
          }
        );
      } else if (newState.status === voice.AudioPlayerStatus.Playing) {
        // on start

        Guild.findOne(
          {
            guildID: guild.id,
          },
          (err, Gres) => {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }
            //dispatcher.setBitrate((plus) ? ((serverQueue.connection.voice.channel.bitrate >= 256) ? 256 : (serverQueue.connection.voice.channel.bitrate < 256) ? serverQueue.connection.voice.channel.bitrate : 96) : ((serverQueue.connection.voice.channel.bitrate < 96) ? serverQueue.connection.voice.channel.bitrate : 96));
            serverQueue.audioPlayer.state?.resource.volume.setVolume(
              Number(Gres.musicBotVolume) / 100
            );
          }
        );

        Guild.findOneAndUpdate(
          {
            guildID: guild.id,
          },
          {
            musicBotPlaying: true,
            musicBotSkipVotedMembersID: [],
            musicBotSkipVotesNeeded: 0,
            musicBotPlayTime:
              song.seek == null
                ? new Date()
                : new Date(new Date().getTime() - song.seek * 1000),
          },
          function (err) {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }
          }
        );
      }
    });
  }

  function createYTDL(url) {
    return ytdl(url, {
      quality: "highestaudio",
      filter: "audio",
      audioBitrate: 96,
      highWaterMark: 1 << 25,
    });
  }
  async function createSafeYTDL(url, guild) {
    async function getInfo() {
      var info;
      try {
        info = await ytdl.getInfo(url);
      } catch (err) {
        if (
          err.statusCode == 403 ||
          err.statusCode == 404 ||
          err.statusCode == 410
        ) {
          if (err.statusCode == 410) {
            Guild.findOne(
              {
                guildID: guild.id,
              },
              async (err, Gres) => {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }
                var channel = await bot.channels.fetch(
                  Gres.musicBotTxtChannelID
                );
                if (
                  channel.permissionsFor(guild.me).has("SEND_MESSAGES")
                ) {
                  channel.send(
                    template(
                      LMessages.music.error,
                      {
                        errr: "Youtube: Cannot play age restricted video. (410) - Skipping",
                      },
                      { before: "%", after: "%" }
                    )
                  );
                }
                var serverQueue = queue.get(guild.id);
                if (serverQueue) {
                  if (serverQueue.songs.length > 0) {
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0], false);
                  }
                }
                return;
              }
            );
          } else {
            console.log("errrrr");
            console.error(err);
            info = getInfo();
          }
        } else {
          console.error(err);
          Guild.findOne(
            {
              guildID: guild.id,
            },
            async (err, Gres) => {
              if (err) {
                console.error(err);
                error.sendError(err);
                return;
              }
              var channel = await bot.channels.fetch(Gres.musicBotTxtChannelID);
              if (
                channel.permissionsFor(guild.me).has("SEND_MESSAGES")
              ) {
                channel.send(LMessages.musicError);
              }
              return;
            }
          );
        }
      }
      if (info) {
        return info;
      } else {
        return 410;
      }
    }
    var info = await getInfo();
    if (info == 410) return 410;
    var stream = ytdl.downloadFromInfo(info, {
      quality: "highestaudio",
      filter: "audio",
      audioBitrate: 96,
      highWaterMark: 1 << 25,
    });
    return stream;
  }
  var stream = await createSafeYTDL(song.url, guild);
  if (stream != 410) {
    serverQueue.audioPlayer.play(
      voice.createAudioResource(stream, {
        inlineVolume: true,
      })
    );
  }
  /*
  var player = serverQueue.audioPlayer;
  var stream = createYTDL(song.url);
  var resource = voice.createAudioResource(stream, {
    inlineVolume: true,
  });
  resource.playStream.removeAllListeners("error");

  player.play(resource);

  resource.playStream.once("error", (err) => {
    console.log("errrrr");
    player.stop(true);
    player.removeAllListeners("error");
    resource.playStream.removeAllListeners("error");
    serverQueue.audioPlayer = null;
    play(guild, song, true);
  });
  setTimeout(() => {
    player.removeAllListeners("error");
    resource.playStream.removeAllListeners("error");
  }, 500);
*/
  serverQueue.connection.subscribe(serverQueue.audioPlayer);

  return;
};

async function callLoop() {
  setInterval(async () => {
    Guild.find({}).then(async (gGuilds) => {
      gGuilds.forEach(async (Gres) => {
        const guild = await bot.guilds.fetch(Gres.guildID);
        var serverQueue = queue.get(Gres.guildID);
        var vChannel = guild ? guild.me.voice.channel : undefined;
        var one = 0;
        var two = 0;
        var three = 0;

        if (vChannel) {
          if (Gres.musicBotPlaying == false) {
            if (!Gres.musicBotPaused) {
              ////////////////// NOT PAUSED CHANNEL - musicBotCounter

              if (Gres.musicBotCounter >= 100) {
                if (serverQueue) {
                  if (serverQueue.connection) {
                    if (
                      serverQueue.connection.state.status !==
                      voice.VoiceConnectionStatus.Destroyed
                    ) {
                      serverQueue.connection.destroy();
                    }
                  }
                  stopET(Gres.guildID, serverQueue);
                }
              } else {
                one = Gres.musicBotCounter + 1;
                three = 0;
              }
            } else {
              ////////////////// PAUSED CHANNEL - musicBotCounter3

              if (Gres.musicBotCounter3 >= 1000) {
                if (serverQueue) {
                  if (serverQueue.connection) {
                    if (
                      serverQueue.connection.state.status !==
                      voice.VoiceConnectionStatus.Destroyed
                    ) {
                      serverQueue.connection.destroy();
                    }
                  }
                  stopET(Gres.guildID, serverQueue);
                }
              } else {
                three = Gres.musicBotCounter3 + 1;
                one = 0;
              }
            }
          } else {
            one = 0;
          }

          ////////////////// EMPTY CHANNEL - musicBotCounter2

          if (vChannel.members.size <= 1) {
            if (Gres.musicBotCounter2 >= 100) {
              if (serverQueue) {
                if (serverQueue.connection) {
                  if (
                    serverQueue.connection.state.status !==
                    voice.VoiceConnectionStatus.Destroyed
                  ) {
                    serverQueue.connection.destroy();
                  }
                }
                stopET(Gres.guildID, serverQueue);
              }
            } else {
              two = Gres.musicBotCounter2 + 1;
            }
          } else {
            Guild.findOneAndUpdate(
              {
                guildID: Gres.guildID,
              },
              {
                musicBotCounter2: 0,
              },
              function (err) {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }
              }
            );
          }
        }
        Guild.findOneAndUpdate(
          {
            guildID: Gres.guildID,
          },
          {
            musicBotCounter: one,
            musicBotCounter2: two,
            musicBotCounter3: three,
          },
          function (err) {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }
          }
        );
      });
    });
  }, 5000);
}

bot.on("voiceStateUpdate", (oldVoice, newVoice) => {
  if (newVoice.member == newVoice.guild.me) {
    if (newVoice.channel == null) {
      const serverQueue = queue.get(newVoice.guild.id);
      if (serverQueue) {
        if (serverQueue.connection) {
          if (
            serverQueue.connection.state.status !==
            voice.VoiceConnectionStatus.Destroyed
          ) {
            serverQueue.connection.destroy();
          }
        }
        stopET(newVoice.guild.id, serverQueue);
      }
    }
  }
});

bot.on("channelDelete", (channel) => {
  Guild.findOne(
    {
      guildID: channel.guild.id,
    },
    (err, Gres) => {
      if (err) {
        console.error(err);
        error.sendError(err);
        return;
      }
      if (Gres.blacklist.includes(channel.id)) {
        Guild.findOneAndUpdate(
          {
            guildID: channel.guild.id,
          },
          {
            $pull: { blacklist: channel.id },
          },
          (err) => {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }
          }
        );
      }
    }
  );
});

function stopET(id, serverQueue) {
  if (serverQueue) {
    if (serverQueue.audioPlayer) {
      serverQueue.audioPlayer.stop();
    }
    queue.delete(id);
  }

  Guild.findOne(
    {
      guildID: id,
    },
    (err, Gres) => {
      if (err) {
        console.error(err);
        error.sendError(err);
        return;
      }

      Guild.findOneAndUpdate(
        {
          guildID: id,
        },
        {
          musicBotCounter: 0,
          musicBotCounter2: 0,
          musicBotCounter3: 0,
          musicBotPaused: false,
          musicBotPlaying: false,
          musicBotTxtChannelID: null,
          musicBotVolume: Gres.musicBotDefaultVolume,
        },
        function (err) {
          if (err) {
            console.error(err);
            error.sendError(err);
            return;
          }
        }
      );
    }
  );
}

async function stateChange(serverQueue, guild) {
  serverQueue.connection.on("stateChange", async (_, newState) => {
    if (newState.status == voice.VoiceConnectionStatus.Disconnected) {
      if (
        newState.reason ==
          voice.VoiceConnectionDisconnectReason.WebSocketClose &&
        newState.closeCode == 4014
      ) {
        try {
          await voice.entersState(
            serverQueue.connection,
            voice.VoiceConnectionStatus.Connecting,
            5000
          );
        } catch {
          if (
            serverQueue.connection.state.status !==
            voice.VoiceConnectionStatus.Destroyed
          ) {
            serverQueue.connection.destroy();
          }
        }
      } else if (serverQueue.connection.rejoinAttempts < 5) {
        await wait((serverQueue.connection.rejoinAttempts + 1) * 5000);
        serverQueue.connection.rejoin();
      } else {
        if (
          serverQueue.connection.state.status !==
          voice.VoiceConnectionStatus.Destroyed
        ) {
          serverQueue.connection.destroy();
        }
      }
      // destroyed //
    } else if (newState.status == voice.VoiceConnectionStatus.Destroyed) {
      stopET(guild.id, serverQueue);

      // connecting & signalling //
    } else if (
      newState.status == voice.VoiceConnectionStatus.Connecting ||
      newState.status == voice.VoiceConnectionStatus.Signalling
    ) {
      try {
        await voice.entersState(
          serverQueue.connection,
          voice.VoiceConnectionStatus.Ready,
          10000
        );
      } catch {
        if (
          serverQueue.connection.state.status !==
          voice.VoiceConnectionStatus.Destroyed
        ) {
          serverQueue.connection.destroy();
        }
      }
    } else if (newState.status == voice.VoiceConnectionStatus.Ready) {
      Guild.findOneAndUpdate(
        {
          guildID: guild.id,
        },
        {
          musicBotCounter: 0,
          musicBotCounter2: 0,
          musicBotCounter3: 0,
        },
        function (err) {
          if (err) {
            console.error(err);
            error.sendError(err);
            return;
          }
        }
      );
    }
  });
}
module.exports.queue = queue;
module.exports.play = play;
module.exports.stateChange = stateChange;
module.exports.stopET = stopET;
