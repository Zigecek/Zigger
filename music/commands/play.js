const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const ytsr = require("ytsr");
const isUrl = require("is-url");
const music = require("../music");
const { parseTimestamp } = require("m3u8stream");
const error = require("../../utils/error");
const template = require("string-placeholder");
const sec2human = require("sec2human");
const Guild = require("../../models/guild");
const config = require("../../config.js");
const voice = require("@discordjs/voice");
const LMessages = require(`../../messages/`);
const short = require("short-uuid");

module.exports = {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  category: "music",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.channel.send(LMessages.music.need.toBeInVoice);
      return;
    }
    if (
      !voiceChannel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.ManageRoles) ||
      !voiceChannel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.Speak) ||
      !voiceChannel.joinable ||
      !voiceChannel.viewable
    ) {
      if (
        message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)
      ) {
        message.channel.send(LMessages.musicBotHasNoPermission);
      }
      return;
    }
    if (message.guild.members.me.voice.channel) {
      if (Gres.musicBotPlaying) {
        if (
          message.guild.members.me.voice.channel.id != message.member.voice.channel.id
        ) {
          if (
            message.channel
              .permissionsFor(message.guild.members.me)
              .has(Discord.PermissionFlagsBits.SendMessages)
          ) {
            message.channel.send(LMessages.music.botIsPlaying);
          }
          return;
        }
      }
    }
    if (args.join(" ") == "" || args.join(" ") == " ") {
      if (
        message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)
      ) {
        message.channel.send(LMessages.musicNoQuery);
      }
      return;
    }
    await Guild.updateOne(
      {
        guildID: message.guild.id,
      },
      {
        musicBotTxtChannelID: message.channel.id,
        musicBotPaused: false,
      }
    );

    if (message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
      message.channel.send(
        template(
          LMessages.musicSearching,
          { query: args.join(" ") },
          { before: "%", after: "%" }
        )
      );
    }

    const createSongURL = () => {
      return new Promise((resolve, reject) => {
        ytdl
          .getBasicInfo(args.join(" "))
          .then((songInfo) => {
            let song = {
              title: songInfo.videoDetails.title,
              url: songInfo.videoDetails.video_url,
              author: songInfo.videoDetails.author.name,
              duration: songInfo.videoDetails.isLive
                ? "LIVE!"
                : sec2human(songInfo.videoDetails.lengthSeconds),
              sDur: songInfo.videoDetails.isLive
                ? "LIVE!"
                : songInfo.videoDetails.lengthSeconds,
              thumbnail: songInfo.videoDetails.thumbnails.reduce(
                (prev, curr) => {
                  if (prev.width > curr.width) {
                    return prev;
                  } else {
                    return curr;
                  }
                }
              ).url,
              seek: null,
              uuid: short.generate(),
            };
            resolve(song);
          })
          .catch((err) => {
            if (err.statusCode == 404 || err.statusCode == 403) {
              resolve(404);
            } else if (err.statusCode == 410) {
              resolve(410);
            } else {
              reject(err);
            }
          });
      }).catch(console.error);
    };

    const createSongNonURL = () => {
      return new Promise((resolve, reject) => {
        ytsr(args.join(" "), {
          limit: 10,
          filter: "audioonly",
          quality: "highestaudio",
          highWaterMark: 10485760,
          requestOptions: {
            headers: {
              cookie: "",
            },
          },
        })
          .then((result) => {
            const video = result.items.filter((i) => i.type == "video")[0];
            if (!video) {
              resolve(null);
            }
            let song = {
              title: video.title,
              url: video.url,
              author: video.author.name,
              duration: video.isLive ? "LIVE!" : video.duration,
              sDur: video.isLive
                ? "LIVE!"
                : Math.floor(parseTimestamp(video.duration) / 1000),
              thumbnail: video.bestThumbnail.url,
              seek: null,
              uuid: short.generate(),
            };
            resolve(song);
          })
          .catch(reject);
      }).catch(console.error);
    };

    const createPlaylist = () => {
      return new Promise((resolve, reject) => {
        let ar = [];
        ytpl(args.join(" "), {
          limit: Infinity,
        })
          .then((res) => {
            res.items.forEach((e) => {
              ar.push({
                title: e.title,
                url: e.shortUrl,
                author: e.author.name,
                duration: e.isLive ? "LIVE!" : e.duration,
                sDur: e.isLive ? "LIVE!" : e.durationSec,
                thumbnail: e.thumbnails.pop().url,
                seek: null,
                uuid: short.generate(),
              });
            });
            resolve({
              items: ar,
              info: {
                title: res.title,
                url: res.url,
                estimatedItemCount: res.estimatedItemCount,
              },
            });
          })
          .catch(reject);
      }).catch(console.error);
    };

    var song = null;
    var playlist = null;
    var playlistInfo;
    var mode;
    var newJoin = message.guild.members.me.voice.channel
      ? message.guild.members.me.voice.channel.id != voiceChannel.id
        ? true
        : false
      : true;
    var newQueue = serverQueue
      ? serverQueue.songs.length == 0
        ? true
        : false
      : true;

    if (isUrl(args.join(" "))) {
      if (ytdl.validateURL(args.join(" "))) {
        mode = 1;
        song = await createSongURL();
        if (song == 404) {
          message.channel.send(
            template(
              LMessages.music.error,
              {
                errr: "Youtube: Loading information for a YouTube track failed.",
              },
              { before: "%", after: "%" }
            )
          );
          return;
        } else if (song == 410) {
          message.channel.send(
            template(
              LMessages.music.error,
              {
                errr: "Youtube: Cannot play age restricted video. (410)",
              },
              { before: "%", after: "%" }
            )
          );
          return;
        }
      } else if (ytpl.validateID(args.join(" "))) {
        mode = 2;
        var pl = await createPlaylist();
        if (pl) {
          playlist = pl.items;
          playlistInfo = pl.info;
        } else {
          if (
            message.channel
              .permissionsFor(message.guild.members.me)
              .has(Discord.PermissionFlagsBits.SendMessages)
          ) {
            message.channel.send(LMessages.musicWrongUrl);
          }
          return;
        }
      } else {
        if (
          message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)
        ) {
          message.channel.send(LMessages.musicWrongUrl);
        }
        return;
      }
    } else {
      mode = 1;
      song = await createSongNonURL();
      if (song == null) {
        if (
          message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)
        ) {
          message.channel.send(LMessages.musicNothingFound);
        }
        return;
      }
    }

    let queueConstructor = {
      connection: null,
      songs: [],
    };

    if (!newQueue) {
      if (mode == 1) {
        serverQueue.songs.push(song);
      } else {
        serverQueue.songs = serverQueue.songs.concat(playlist);
      }
    } else {
      if (mode == 1) {
        queueConstructor.songs.push(song);
      } else {
        queueConstructor.songs = playlist;
      }
      music.queue.set(message.guild.id, queueConstructor);
    }
    serverQueue = music.queue.get(message.guild.id);

    const annouceSP = (res) => {
      if (Gres.annouce == 1) {
        const Embed = new Discord.EmbedBuilder();
        if (mode == 1) {
          Embed.setColor(config.colors.red)
            .setTitle(LMessages.musicSongAddToQueue)
            .setThumbnail(res.thumbnail)
            .addFields(
              {
                name: LMessages.musicName,
                value: `[${res.title}](${res.url})`,
              },
              {
                name: LMessages.musicDuration,
                value: res.duration,
              }
            );
        } else {
          Embed.setColor(config.colors.red)
            .setTitle(
              template(
                LMessages.musicPlaylistAddToQueue,
                { songs: res.estimatedItemCount },
                { before: "%", after: "%" }
              )
            )
            .addFields(
              {
                name: LMessages.musicName,
                value: `[${res.title}](${res.url})`,
              } /*, {
                            name: LMessages.musicNumberOfSongsAdded, value: (res.estimatedItemCount > 100) ? 100 : res.estimatedItemCount
                        }*/
            );
        }
        if (
          message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)
        ) {
          if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.EmbedLinks)) {
            message.channel.send({ embeds: [Embed] });
          } else {
            if (mode == 2) {
              message.channel.send(
                "**" +
                  template(
                    LMessages.musicPlaylistAddToQueue,
                    { songs: res.estimatedItemCount },
                    { before: "%", after: "%" }
                  ) +
                  "** " +
                  "`" +
                  res.title /*+ '` **`(' + ((res.estimatedItemCount > 100) ? 100 : res.estimatedItemCount) + ')`**'*/ /* TEMP TEMP TEMP ->*/ +
                  "` **" /**/
              );
            } else {
              message.channel.send(
                "**" +
                  LMessages.musicSongAddToQueue +
                  "** " +
                  "`" +
                  res.title +
                  "` **`(" +
                  res.duration +
                  ")`**"
              );
            }
          }
        }
      } else if (Gres.annouce == 0) {
        return;
      } else if (Gres.annouce == 3) {
        if (mode == 2) {
          message.channel.send(
            "**" +
              template(
                LMessages.musicPlaylistAddToQueue,
                { songs: res.estimatedItemCount },
                { before: "%", after: "%" }
              ) +
              "** " +
              "`" +
              res.title /*+ '` **`(' + ((res.estimatedItemCount > 100) ? 100 : res.estimatedItemCount) + ')`**'*/ /* TEMP TEMP TEMP ->*/ +
              "` **" /**/
          );
        } else {
          message.channel.send(
            "**" +
              LMessages.musicSongAddToQueue +
              "** " +
              "`" +
              res.title +
              "` **`(" +
              res.duration +
              ")`**"
          );
        }
      }
    };

    if (newQueue) {
      if (newJoin) {
        await Guild.updateOne(
          {
            guildID: message.guild.id,
          },
          {
            musicBotLoop: false,
            musicBotQueueLoop: false,
          }
        );
        if (
          message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)
        ) {
          message.channel.send(
            template(
              LMessages.music.otherCmds.joined,
              { voice: voiceChannel.name },
              { before: "%", after: "%" }
            )
          );
        }
      }
      const lastCon = serverQueue.connection;
      if (!lastCon || lastCon.joinConfig.channelId != voiceChannel.id) {
        serverQueue.connection = voice.joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        music.stateChange(serverQueue, message.guild);
      }
      /*
            if (lastCon) {
                if (lastCon != serverQueue.connection) {
                    music.stateChange(serverQueue, message.guild);
                }
            } else {
                music.stateChange(serverQueue, message.guild);
            }
            */

      music.play(message.guild, serverQueue.songs[0], false);

      try {
        await voice.entersState(
          serverQueue.connection,
          voice.VoiceConnectionStatus.Ready,
          10000
        );
      } catch (err) {
        console.error(err);
        error.sendError(err);

        //music.queue.delete(message.guild.id);
        if (
          message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)
        ) {
          message.channel.send(LMessages.musicError);
        }

        serverQueue.connection.destroy();
        return;
      }

      if (mode == 2) {
        annouceSP(playlistInfo);
      }
    } else {
      if (mode == 1) {
        annouceSP(song);
      } else {
        annouceSP(playlistInfo);
      }
    }
  },
};
