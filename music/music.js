const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const { bot } = require("../bot");
const error = require("../utils/error");
const Guild = require("../models/guild");
const config = require("../config.js");
const voice = require("@discordjs/voice");
const LMessages = require(`../messages/`);
const template = require("string-placeholder");
const short = require("short-uuid");
const { followReply } = require("../utils/functions");
const { Converter } = require("ffmpeg-stream");

var queue = new Map();

function wait(time) {
  return new Promise((resolve) => setTimeout(resolve, time).unref());
}

const ready = async () => {
  console.log(" ");
  console.log("MusicBot - Hraju!");

  await Guild.updateMany(
    {},
    {
      musicBotLastUUID: null,
      musicBotLoop: false,
      musicBotPaused: false,
      musicBotPauseElapsed: 0,
      musicBotPlaying: false,
      musicBotQueueLoop: false,
      musicBotTxtChannelID: null,
      musicBotVolume: 80,
    }
  );
};

const play = async (guild, song, errored) => {
  let serverQueue = queue.get(guild.id);
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
  let Gres = await Guild.findOne({
    guildID: guild.id,
  });
  if (!errored) {
    if (song.seek == null) {
      let content;
      let channel = await bot.channels.fetch(Gres.musicBotTxtChannelID);
      if (channel) {
        if (Gres.annouce == 1) {
          if (
            guild.members.me.permissions.has(
              Discord.PermissionFlagsBits.EmbedLinks
            )
          ) {
            const Embed = new Discord.EmbedBuilder()
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
            content = { embeds: [Embed] };
          } else {
            content = {
              content:
                "**" +
                LMessages.musicNowPlaying +
                "** " +
                "`" +
                song.title +
                "` **`(" +
                song.duration +
                ")`**",
            };
          }
        } else if (Gres.annouce == 3) {
          content = {
            content:
              "**" +
              LMessages.musicNowPlaying +
              "** " +
              "`" +
              song.title +
              "` **`(" +
              song.duration +
              ")`**",
          };
        }

        var controlRow = new Discord.ActionRowBuilder().setComponents([
          new Discord.ButtonBuilder()
            .setCustomId("pauseResume")
            .setLabel("⏯")
            .setStyle(Discord.ButtonStyle.Danger)
            .setDisabled(false),
          new Discord.ButtonBuilder()
            .setCustomId("skip")
            .setLabel("⏭")
            .setStyle(Discord.ButtonStyle.Primary)
            .setDisabled(false),
        ]);
        if (song.sDur != "LIVE!") {
          content.components = [controlRow];
          let msg = await channel.send(content);
          const songUUID = song.uuid;
          const collector = msg.createMessageComponentCollector({
            time: song.sDur * 1000,
          });
          collector
            .on("collect", async (interact) => {
              if (!interact.isButton()) return;
              if (!interact.member.voice.channelId) return;
              if (!interact.guild.members.me.voice.channelId) return;
              if (
                interact.member.voice.channelId !=
                interact.guild.members.me.voice.channelId
              )
                return;
              let id = interact.component.customId;

              Gres = await Guild.findOne({
                guildID: guild.id,
              });
              serverQueue = queue.get(guild.id);
              if (id == "pauseResume") {
                if (serverQueue.songs[0]?.uuid != songUUID) {
                  collector.stop();

                  if (
                    interact.channel
                      .permissionsFor(interact.guild.members.me)
                      .has(Discord.PermissionFlagsBits.SendMessages)
                  ) {
                    followReply(interact, {
                      content: LMessages.music.skip.differentUUID,
                    });
                  }
                  return;
                }

                if (Gres.musicBotPaused) {
                  // resume
                  await Guild.updateOne(
                    {
                      guildID: guild.id,
                    },
                    {
                      musicBotPaused: false,
                      musicBotPlaying: true,
                      musicBotPauseElapsed: 0,
                      musicBotPlayTime: new Date(
                        Date.now() - Gres.musicBotPauseElapsed
                      ),
                    }
                  );
                  if (serverQueue) {
                    if (serverQueue.audioPlayer) {
                      serverQueue.audioPlayer.unpause();
                    }
                  }
                  let timerMS =
                    serverQueue.songs[0].sDur * 1000 -
                    (Date.now() - Gres.musicBotPlayTime.getTime());
                  collector.resetTimer({
                    time: timerMS,
                  });

                  if (
                    interact.channel
                      .permissionsFor(interact.guild.members.me)
                      .has(Discord.PermissionFlagsBits.SendMessages)
                  ) {
                    followReply(interact, {
                      content: LMessages.music.otherCmds.resume,
                    });
                  }
                } else {
                  // pause
                  collector.resetTimer({
                    time: 900 * 1000,
                  });

                  const elMsecs = Date.now() - Gres.musicBotPlayTime.getTime();
                  await Guild.updateOne(
                    {
                      guildID: guild.id,
                    },
                    {
                      musicBotPaused: true,
                      musicBotPlaying: false,
                      musicBotPauseElapsed: elMsecs,
                    }
                  );
                  if (serverQueue) {
                    if (serverQueue.audioPlayer) {
                      serverQueue.audioPlayer.pause(true);
                    }
                  }

                  if (
                    interact.channel
                      .permissionsFor(interact.guild.members.me)
                      .has(Discord.PermissionFlagsBits.SendMessages)
                  ) {
                    followReply(interact, {
                      content: LMessages.music.otherCmds.pause,
                    });
                  }
                }
              } else if (id == "skip") {
                if (serverQueue.songs[0]?.uuid != songUUID) {
                  collector.stop();

                  if (
                    interact.channel
                      .permissionsFor(interact.guild.members.me)
                      .has(Discord.PermissionFlagsBits.SendMessages)
                  ) {
                    followReply(interact, {
                      content: LMessages.music.skip.differentUUID,
                    });
                  }
                  return;
                }
                if (serverQueue) {
                  if (serverQueue.audioPlayer) {
                    serverQueue.audioPlayer.stop();
                    serverQueue.audioPlayer.unpause();
                  }
                }

                if (
                  interact.channel
                    .permissionsFor(interact.guild.members.me)
                    .has(Discord.PermissionFlagsBits.SendMessages)
                ) {
                  followReply(interact, {
                    content: LMessages.music.skip.FSkipped,
                  });
                }

                collector.stop();
              }
            })
            .on("end", () => {
              if (msg) {
                msg.components.forEach((r) => {
                  r.components.forEach((b) => {
                    Discord.ButtonBuilder.from(b).setDisabled(true);
                  });
                });
              }
            });
        } else {
          channel.send(content);
        }
      }
    }
  }

  if (!serverQueue.audioPlayer) {
    serverQueue.audioPlayer = voice.createAudioPlayer();

    queue.set(guild.id, serverQueue);

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
                }
              }
              stopET(guild.id, serverQueue);
            }
          }
        }, 300 * 1000); // 300

        let Gres = await Guild.findOne({
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

        let Gres = await Guild.findOne({
          guildID: guild.id,
        });
        serverQueue.audioPlayer.state?.resource?.volume.setVolume(
          Number(Gres.musicBotVolume) / 100
        );

        if (
          guild.members.me.voice.channel?.members.filter((x) => !x.user.bot)
            .size > 0
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
            musicBotPlayTime:
              song.seek == null
                ? new Date()
                : new Date(Date.now() - song.seek * 1000),
          }
        );
      }
    });
  }

  serverQueue.audioPlayer.removeAllListeners("error");
  serverQueue.audioPlayer.on("error", () => {
    serverQueue.audioPlayer.removeAllListeners("error");
    serverQueue.audioPlayer.removeAllListeners("stateChange");
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
          audioBitrate: 96,
          highWaterMark: 1 << 25,
        });
      })
      .catch(async (err) => {
        let Gres = await Guild.findOne({
          guildID: guild.id,
        });
        let channel = await bot.channels.fetch(Gres.musicBotTxtChannelID);

        if (err.statusCode == 410) {
          if (
            channel
              .permissionsFor(guild.members.me)
              .has(Discord.PermissionFlagsBits.SendMessages)
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
          let serverQueue = queue.get(guild.id);
          if (serverQueue) {
            if (serverQueue.songs.length > 0) {
              serverQueue.songs.shift();
              play(guild, serverQueue.songs[0], false);
            }
          }
          return;
        } else {
          console.error(err);
          error.sendError(err);
          if (
            channel
              .permissionsFor(guild.members.me)
              .has(Discord.PermissionFlagsBits.SendMessages)
          ) {
            channel.send(LMessages.musicError);
          }
          return;
        }
      });

    /*

    const converter = new Converter();

    // get a writable input stream and pipe an image file to it
    const input = converter.createInputStream({
      //vcodec: "opus",
    });
    stream.pipe(input);

    // create an output stream, crop/scale image, save to file via node stream
    let retStream = converter.createOutputStream({
      vn: "",
      af: "bass=g=3:f=110:w=0.6",
      //acodec: "libmp3lame",
    });

    try {
      await converter.run();
      stream = retStream;
    } catch (ferr) {
      if (ferr) {
        console.error(ferr);
        let Gres = await Guild.findOne({
          guildID: guild.id,
        });
        let channel = await bot.channels.fetch(Gres.musicBotTxtChannelID);
        if (
          channel
            .permissionsFor(guild.members.me)
            .has(Discord.PermissionFlagsBits.SendMessages)
        ) {
          channel.send(
            template(
              LMessages.music.error,
              {
                errr: "FFMpeg: " + ferr,
              },
              { before: "%", after: "%" }
            )
          );
        }
        let serverQueue = queue.get(guild.id);
        if (serverQueue) {
          if (serverQueue.songs.length > 0) {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0], false);
          }
        }
        return;
      }
    }

    */

    return stream;
  }
  let stream = await createSafeYTDL(song.url, guild);
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

const voiceStateUpdate = async (oldVoice, newVoice) => {
  if (newVoice.channel == null) {
    if (newVoice.member == newVoice.guild.members.me) {
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
      if (oldVoice.channel.members.filter((x) => !x.user.bot).size - 1 == 0) {
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
          let Gres = await Guild.findOne({
            guildID: newVoice.guild.id,
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

const channelDelete = async (channel) => {
  let Gres = await Guild.findOne({
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
      serverQueue.audioPlayer.unpause();
    }
    queue.delete(id);
  }

  let Gres = await Guild.findOne({
    guildID: id,
  });

  await Guild.updateOne(
    {
      guildID: id,
    },
    {
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
