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
const ytsr = require("ytsr");
const { bot } = require("../../bot");
const music = require("../music");
const error = require("../../utils/error");
var decode = require("ent/decode");
const template = require("string-placeholder");
const { parseTimestamp } = require("m3u8stream");
const Guild = require("../../models/guild");
const config = require("../../config.json");
const voice = require("@discordjs/voice");
const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "search",
  cooldown: 3,
  aliases: [],
  category: "music",
  async execute(int, serverQueue, Gres) {
    if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) return;
    const voiceChannel = int.member.voice.channel;
    if (!voiceChannel) {
      if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
        followReply(int, { content: LMessages.music.need.toBeInVoice });
      }
      return;
    }
    const permissions = voiceChannel.permissionsFor(int.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
        followReply(int, { content: LMessages.musicBotHasNoPermission });
      }
      return;
    }
    if (int.guild.me.voice.channel) {
      if (Gres.musicBotPlaying) {
        if (int.guild.me.voice.channel.id != int.member.voice.channel.id) {
          if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
            followReply(int, { content: LMessages.music.botIsPlaying });
          }
          return;
        }
      }
    }

    if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
      followReply(int, {
        content: template(
          LMessages.musicSearching,
          { query: int.options.get("query").value },
          { before: "%", after: "%" }
        ),
      });
    }

    ytsr(int.options.get("query").value, {
      limit: 30,
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 10485760,
      requestOptions: {
        headers: {
          cookie: "",
        },
      },
    }).then(async (result) => {
      const tracks = result.items.filter((x) => x.type == "video").slice(0, 10);
      if (!tracks) {
        if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
          followReply(int, { content: LMessages.musicNothingFound });
        }
        return;
      }
      let i = 0;
      var tracksInfo =
        "```\n" +
        tracks.map((track) => `\n${++i}. ${decode(track.title)}`) +
        "\n```";
      if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
        followReply(int, {
          content: template(
            LMessages.musicSearch,
            { tracks: tracksInfo },
            { before: "%", after: "%" }
          ),
        }).then(async (smessage) => {
          followReply(int, { content: LMessages.musicTypeNumber });
          const filter = (m) => m.author.id == int.user.id;
          const collector = smessage.channel
            .createMessageCollector({ filter, time: 30000 })
            .on("collect", (m) => {
              if (m.content == "1") {
                rSearch(0, int, tracks, collector);
              } else if (m.content == "2") {
                rSearch(1, int, tracks, collector);
              } else if (m.content == "3") {
                rSearch(2, int, tracks, collector);
              } else if (m.content == "4") {
                rSearch(3, int, tracks, collector);
              } else if (m.content == "5") {
                rSearch(4, int, tracks, collector);
              } else if (m.content == "6") {
                rSearch(5, int, tracks, collector);
              } else if (m.content == "7") {
                rSearch(6, int, tracks, collector);
              } else if (m.content == "8") {
                rSearch(7, int, tracks, collector);
              } else if (m.content == "9") {
                rSearch(8, int, tracks, collector);
              } else if (m.content == "10") {
                rSearch(9, int, tracks, collector);
              } else {
                collector.stop();
                return;
              }
            })
            .on("end", async (collected) => {
              if (smessage) {
                if (smessage.deletable) {
                  if (int.guild.me.permissions.has("MANAGE_MESSAGES")) {
                    smessage.delete();
                  }
                }
              }
            });
          async function rSearch(index, int, tracks, collector) {
            collector.stop();
            const voiceChannel = int.member.voice.channel;

            let song = {
              title: tracks[index].title,
              url: tracks[index].url,
              author: tracks[index].author.name,
              duration: tracks[index].isLive ? "LIVE!" : tracks[index].duration,
              sDur: tracks[index].isLive
                ? "LIVE!"
                : Math.floor(parseTimestamp(tracks[index].duration) / 1000),
              thumbnail: tracks[index].thumbnails.pop().url,
              seek: null,
            };
            Guild.findOneAndUpdate(
              {
                guildID: int.guild.id,
              },
              {
                musicBotTxtChannelID: int.channel.id,
                musicBotPaused: false,
              },
              function (err) {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }
              }
            );

            let queueConstructor = {
              connection: null,
              songs: [],
            };

            if (!serverQueue) {
              queueConstructor.songs.push(song);
              music.queue.set(int.guild.id, queueConstructor);
              serverQueue = music.queue.get(int.guild.id);

              try {
                if (int.guild.me.voice.channel) {
                  if (int.guild.me.voice.channel.id != voiceChannel.id) {
                    followReply(int, {
                      content: template(
                        LMessages.music.otherCmds.joined,
                        { voice: voiceChannel.name },
                        { before: "%", after: "%" }
                      ),
                    });
                    Guild.findOneAndUpdate(
                      {
                        guildID: int.guild.id,
                      },
                      {
                        musicBotLoop: false,
                        musicBotQueueLoop: false,
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
                } else {
                  followReply(int, {
                    content: template(
                      LMessages.music.otherCmds.joined,
                      { voice: voiceChannel.name },
                      { before: "%", after: "%" }
                    ),
                  });
                  Guild.findOneAndUpdate(
                    {
                      guildID: int.guild.id,
                    },
                    {
                      musicBotLoop: false,
                      musicBotQueueLoop: false,
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

                const lastCon = serverQueue.connection;
                if (
                  !lastCon ||
                  lastCon.joinConfig.channelId != voiceChannel.id
                ) {
                  serverQueue.connection = voice.joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                  });
                  music.stateChange(serverQueue, int.guild);
                }

                music.play(int.guild, serverQueue.songs[0], false);

                try {
                  await voice.entersState(
                    serverQueue.connection,
                    voice.VoiceConnectionStatus.Ready,
                    10000
                  );
                } catch (err) {
                  try {
                    throw Error(err);
                  } catch (err) {
                    console.error(err);
                    error.sendError(err);
                  }
                  music.queue.delete(int.guild.id);
                  if (
                    int.channel
                      .permissionsFor(int.guild.me)
                      .has("SEND_MESSAGES")
                  ) {
                    followReply(int, { content: LMessages.musicError });
                  }
                  return;
                }
              } catch (err) {
                console.error(err);
                error.sendError(err);
                music.queue.delete(int.guild.id);

                followReply(int, { content: LMessages.musicError });
                return;
              }
            } else {
              serverQueue.songs.push(song);

              if (Gres.annouce == 1) {
                const Embed = new Discord.MessageEmbed()
                  .setColor(config.colors.red)
                  .setTitle(LMessages.musicSongAddToQueue)
                  .setThumbnail(song.thumbnail)
                  .addFields(
                    {
                      name: LMessages.musicName,
                      value: `[${song.title}](${song.url})`,
                    },
                    {
                      name: LMessages.musicDuration,
                      value: song.duration,
                    }
                  );

                if (
                  int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")
                ) {
                  if (int.guild.me.permissions.has("EMBED_LINKS")) {
                    followReply(int, { embeds: [Embed] });
                  } else {
                    followReply(int, {
                      content:
                        "**" +
                        LMessages.musicSongAddToQueue +
                        "** " +
                        "`" +
                        song.title +
                        "` **`(" +
                        song.duration +
                        ")`**",
                    });
                  }
                }
              } else if (Gres.annouce == 0) {
                return;
              } else if (Gres.annouce == 3) {
                followReply(int, {
                  content:
                    "**" +
                    LMessages.musicSongAddToQueue +
                    "** " +
                    "`" +
                    song.title +
                    "` **`(" +
                    song.duration +
                    ")`**",
                });
              }
            }
          }
        });
      }
    });
  },
};
