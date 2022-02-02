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
const short = require("short-uuid");
var logger = require("tracer").console();

let queue = new Map();

function wait(time) {
  return new Promise((resolve) => setTimeout(resolve, time).unref());
}

const ready = () => {
  console.log(" ");
  console.log("MusicBot - Hraju!");
  //callLoop();
};

const play = async (guild, song, errored) => {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    await Guild.updateOne(
      {
        guildID: guild.id,
      },
      {
        musicBotPlaying: false,
      }
    );
    return;
  }
  var Gres = await Guild.findOne({
    guildID: guild.id,
  });
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
            bot.channels.fetch(Gres.musicBotTxtChannelID).then((channel) => {
              channel.send({ embeds: [Embed] });
            });
          } else {
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

  if (!serverQueue.audioPlayer) {
    serverQueue.audioPlayer = voice.createAudioPlayer();

    serverQueue.audioPlayer.on("stateChange", async (oldState, newState) => {
      if (
        // Paused
        newState.status == voice.AudioPlayerStatus.Paused &&
        oldState.status != voice.AudioPlayerStatus.Paused
      ) {
        const uid = short.generate();
        await Guild.updateOne(
          {
            guildID: guild.id,
          },
          {
            musicBotLastUUID: uid,
          }
        );
        setTimeout(async () => {
          var Gres = await Guild.findOne({
            guildID: guild.id,
          });
          if (uid == Gres.musicBotLastUUID) {
            const serverQueue = queue.get(guild.id);
            if (serverQueue) {
              if (serverQueue.connection) {
                if (
                  serverQueue.connection.state.status !==
                  voice.VoiceConnectionStatus.Destroyed
                ) {
                  serverQueue.connection.destroy();
                  logger.log(Gres);
                }
              }
              stopET(guild.id, serverQueue);
            }
          }
        }, 900 * 1000); // 900
      } else if (
        // Resumed
        newState.status != voice.AudioPlayerStatus.Paused &&
        oldState.status == voice.AudioPlayerStatus.Paused
      ) {
        await Guild.updateOne(
          {
            guildID: guild.id,
          },
          {
            musicBotLastUUID: "nothing",
          }
        );
      } else if (
        newState.status === voice.AudioPlayerStatus.Idle &&
        oldState.status !== voice.AudioPlayerStatus.Idle
      ) {
        //  on finish
        const uid = short.generate();
        await Guild.updateOne(
          {
            guildID: guild.id,
          },
          {
            musicBotSkipVotedMembersID: [],
            musicBotSkipVotesNeeded: 0,
            musicBotLastUUID: uid,
          }
        );

        setTimeout(async () => {
          var Gres = await Guild.findOne({
            guildID: guild.id,
          });
          if (uid == Gres.musicBotLastUUID) {
            const serverQueue = queue.get(guild.id);
            if (serverQueue) {
              if (serverQueue.connection) {
                if (
                  serverQueue.connection.state.status !==
                  voice.VoiceConnectionStatus.Destroyed
                ) {
                  serverQueue.connection.destroy();
                  logger.log(Gres);
                }
              }
              stopET(guild.id, serverQueue);
            }
          }
        }, 300 * 1000); // 300

        var Gres = await Guild.findOne({
          guildID: guild.id,
        });
        if (!Gres.musicBotLoop) {
          if (Gres.musicBotQueueLoop) {
            serverQueue.songs.push(serverQueue.songs.shift());
          } else {
            serverQueue.songs.shift();
          }
        }
        play(guild, serverQueue.songs[0], false);
        return;
      } else if (newState.status === voice.AudioPlayerStatus.Playing) {
        // on start

        var Gres = await Guild.findOne({
          guildID: guild.id,
        });
        serverQueue.audioPlayer.state?.resource.volume.setVolume(
          Number(Gres.musicBotVolume) / 100
        );

        if (
          guild.me.voice.channel.members.filter((x) => !x.user.bot).size > 0
        ) {
          const uid = short.generate();
          await Guild.updateOne(
            {
              guildID: guild.id,
            },
            {
              musicBotLastUUID: uid,
            }
          );
        }
        await Guild.updateOne(
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
          }
        );
      }
    });
  }

  serverQueue.audioPlayer.removeAllListeners("error");
  serverQueue.audioPlayer.on("error", (err) => {
    serverQueue.audioPlayer.removeAllListeners("error");
    serverQueue.audioPlayer.removeAllListeners("stateChange");
    serverQueue.audioPlayer = null;
    play(guild, song, true);
  });

  async function createSafeYTDL(url, guild) {
    let stream = null;
    await ytdl
      .getInfo(url)
      .then((info) => {
        if (!info) return;
        stream = ytdl.downloadFromInfo(info, {
          filter: info.videoDetails.isLiveContent ? null : "audioonly",
          quality: info.videoDetails.isLiveContent ? null : "highestaudio",
          dlChunkSize: 0,
          liveBuffer: 1000,
          isHLS: info.videoDetails.isLiveContent,

          //quality: "highestaudio",
          //filter: "audio",
          audioBitrate: 96,
          highWaterMark: 1 << 25,
          //dlChunkSize: 256 * 1024,
        });
      })
      .catch(async (err) => {
        if (err.statusCode == 410) {
          console.log("errrrr 410");
          var Gres = await Guild.findOne({
            guildID: guild.id,
          });
          if (err) {
            console.error(err);
            error.sendError(err);
            return;
          }
          var channel = await bot.channels.fetch(Gres.musicBotTxtChannelID);
          if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
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
        } else {
          console.error(err);
          var Gres = await Guild.findOne({
            guildID: guild.id,
          });
          var channel = await bot.channels.fetch(Gres.musicBotTxtChannelID);
          if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
            channel.send(LMessages.musicError);
          }
          return;
        }
      });

    return stream;
  }
  var stream = await createSafeYTDL(song.url, guild);
  if (stream) {
    serverQueue.audioPlayer.play(
      voice.createAudioResource(stream, {
        inlineVolume: true,
      })
    );
  }

  serverQueue.connection.subscribe(serverQueue.audioPlayer);
  return;
};

const voiceStateUpdate = async (params) => {
  var oldVoice = params[0];
  var newVoice = params[1];
  if (newVoice.channel == null) {
    if (newVoice.member == newVoice.guild.me) {
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
    } else {
      if (oldVoice.channel.members.filter((x) => !x.user.bot).size == 0) {
        const uid = short.generate();
        await Guild.updateOne(
          {
            guildID: oldVoice.guild.id,
          },
          {
            musicBotLastUUID: uid,
          }
        );
        setTimeout(async () => {
          var Gres = await Guild.findOne({
            guildID: oldVoice.guild.id,
          });
          if (uid == Gres.musicBotLastUUID) {
            const serverQueue = queue.get(newVoice.guild.id);
            if (serverQueue) {
              if (serverQueue.connection) {
                if (
                  serverQueue.connection.state.status !==
                  voice.VoiceConnectionStatus.Destroyed
                ) {
                  serverQueue.connection.destroy();
                  logger.log(Gres);
                }
              }
              stopET(newVoice.guild.id, serverQueue);
            }
          }
        }, 300 * 1000);
      }
    }
  }
};

const channelDelete = async (params) => {
  var channel = params[0];
  var Gres = await Guild.findOne({
    guildID: channel.guild.id,
  });
  if (Gres.blacklist.includes(channel.id)) {
    await Guild.updateOne(
      {
        guildID: channel.guild.id,
      },
      {
        $pull: { blacklist: channel.id },
      }
    );
  }
};

async function stopET(id, serverQueue) {
  if (serverQueue) {
    if (serverQueue.audioPlayer) {
      serverQueue.audioPlayer.stop();
    }
    queue.delete(id);
  }

  var Gres = await Guild.findOne({
    guildID: id,
  });

  await Guild.updateOne(
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
    }
  );
}

function stateChange(serverQueue, guild) {
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
            logger.log(Gres);
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
          logger.log(Gres);
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
          logger.log(Gres);
        }
      }
    } else if (newState.status == voice.VoiceConnectionStatus.Ready) {
      await Guild.updateOne(
        {
          guildID: guild.id,
        },
        {
          musicBotCounter: 0,
          musicBotCounter2: 0,
          musicBotCounter3: 0,
        }
      );
    }
  });
}
module.exports = {
  queue: queue,
  play: play,
  stateChange: stateChange,
  stopET: stopET,
  events: {
    voiceStateUpdate: voiceStateUpdate,
    channelDelete: channelDelete,
    ready: ready,
  },
};
