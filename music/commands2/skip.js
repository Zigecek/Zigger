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

const Guild = require("../../models/guild");
const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "skip",
  cooldown: 3,
  aliases: ["fs", "forceskip"],
  category: "music",
  async execute(int, serverQueue, Gres) {
    if (
      !int.member.voice.channel ||
      int.member.voice.channel != int.guild.me.voice.channel
    ) {
      if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
        followReply(int, { content: LMessages.music.need.toBeInVoiceWithBot });
      }
      return;
    }

    if (!serverQueue) {
      if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
        followReply(int, { content: LMessages.musicNothingPlaying });
      }
      return;
    }

    let role = int.guild.roles.cache.filter((r) => r.position == 1).first();
    var code = role ? role.id : false;

    let role2 = int.guild.roles.cache.filter((r) => r.name == "DJ").first();
    var code2 = role2 ? role2.id : false;

    if (int.options.get("force")?.value) {
      if (
        int.member.voice.channel.members.filter((m) => m.user.bot == false)
          .size >= 3
      ) {
        if (
          int.member.permissions.has("MANAGE_CHANNELS") ||
          int.member.roles.cache.has(code) ||
          int.member.roles.cache.has(code2)
        ) {
          if (!serverQueue) {
            if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
              followReply(int, { content: LMessages.musicEmptyQueue });
            }
            return;
          }
          if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
            followReply(int, { content: LMessages.music.skip.FSkipped });
          }

          if (int.options.get("count").value) {
            var number = isNaN(Number(int.options.get("count").value))
              ? false
              : Number(int.options.get("count").value);
            if (number > 0) {
              if (number != 1) {
                let song1 = serverQueue.songs.shift();
                serverQueue.songs.splice(0, number - 1);
                serverQueue.songs = [song1].concat(serverQueue.songs);
              }
            } else {
              if (
                int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")
              ) {
                followReply(int, { content: LMessages.music.invalidNumber });
              }
              return;
            }
          }

          if (serverQueue) {
            if (serverQueue.audioPlayer) {
              serverQueue.audioPlayer.stop();
            }
          }

          Guild.findOneAndUpdate(
            {
              guildID: int.guild.id,
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
        } else {
          if (!role) {
            if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
              followReply(int, {
                content: LMessages.music.skip.FSNoPermission,
              });
            }
            return;
          } else {
            if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
              followReply(int, {
                content: template(
                  LMessages.music.skip.FSNoPermission2,
                  { role: role.name },
                  { before: "%", after: "%" }
                ),
              });
            }
            return;
          }
        }
      } else {
        if (int.options.get("count")?.value) {
          var number =
            isNaN(Number(int.options.get("count")?.value)) == false
              ? Number(int.options.get("count").value)
              : 0;
          if (number > 0) {
            if (number != 1) {
              let song1 = serverQueue.songs.shift();
              serverQueue.songs.splice(0, number - 1);
              serverQueue.songs = [song1].concat(serverQueue.songs);
            }
          } else {
            if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
              followReply(int, { content: LMessages.music.invalidNumber });
            }
            return;
          }
        }
        if (serverQueue) {
          if (serverQueue.audioPlayer) {
            serverQueue.audioPlayer.stop();
          }
        }
        if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
          followReply(int, { content: LMessages.music.skip.skipped });
        }
        Guild.findOneAndUpdate(
          {
            guildID: int.guild.id,
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
      }
    } else {
      if (!serverQueue) {
        if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
          followReply(int, { content: LMessages.musicEmptyQueue });
        }
        return;
      }
      Guild.findOne(
        {
          guildID: int.guild.id,
        },
        (err, Gres) => {
          if (err) {
            console.error(err);
            error.sendError(err);
            return;
          }
          if (
            int.member.voice.channel.members.filter((m) => m.user.bot == false)
              .size >= 3
          ) {
            if (Gres.musicBotSkipVotedMembersID.length != 0) {
              if (Gres.musicBotSkipVotedMembersID.includes(int.user.id)) {
                if (
                  int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")
                ) {
                  followReply(int, {
                    content: LMessages.music.skip.alreadyVoted,
                  });
                }
                return;
              }
              Guild.updateOne(
                { guildID: int.guild.id },
                { $push: { musicBotSkipVotedMembersID: int.user.id } },
                (err, result) => {
                  if (err) {
                    console.error(err);
                    error.sendError(err);
                    return;
                  }

                  Guild.findOne(
                    {
                      guildID: int.guild.id,
                    },
                    (err, Gres) => {
                      if (err) {
                        console.error(err);
                        error.sendError(err);
                        return;
                      }

                      if (
                        Gres.musicBotSkipVotedMembersID.length >=
                        Gres.musicBotSkipVotesNeeded
                      ) {
                        if (
                          int.channel
                            .permissionsFor(int.guild.me)
                            .has("SEND_MESSAGES")
                        ) {
                          followReply(int, {
                            content: LMessages.music.skip.skipped,
                          });
                        }
                        var number = Gres.musicBotSkipSongs;
                        if (number > 0) {
                          if (number != 1) {
                            let song1 = serverQueue.songs.shift();
                            serverQueue.songs.splice(0, number - 1);
                            serverQueue.songs = [song1].concat(
                              serverQueue.songs
                            );
                          }
                        }

                        if (serverQueue) {
                          if (serverQueue.audioPlayer) {
                            serverQueue.audioPlayer.stop();
                          }
                        }

                        Guild.findOneAndUpdate(
                          {
                            guildID: int.guild.id,
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
                      } else {
                        if (
                          int.channel
                            .permissionsFor(int.guild.me)
                            .has("SEND_MESSAGES")
                        ) {
                          followReply(int, {
                            content: template(
                              LMessages.music.skip.newSkip,
                              {
                                voted: Gres.musicBotSkipVotedMembersID.length,
                                needed: Gres.musicBotSkipVotesNeeded,
                              },
                              { before: "%", after: "%" }
                            ),
                          });
                        }
                      }
                    }
                  );
                }
              );
            } else {
              var number = isNaN(Number(int.options.get("count")?.value))
                ? false
                : Number(int.options.get("count").value);
              if (number) {
                if (!(number > 0)) {
                  if (
                    int.channel
                      .permissionsFor(int.guild.me)
                      .has("SEND_MESSAGES")
                  ) {
                    followReply(int, {
                      content: LMessages.music.invalidNumber,
                    });
                  }
                  return;
                }
              }
              Guild.findOneAndUpdate(
                {
                  guildID: int.guild.id,
                },
                {
                  musicBotSkipSongs: number ? 0 : number,
                  musicBotSkipVotesNeeded: Math.floor(
                    (int.member.voice.channel.members.filter(
                      (m) => m.user.bot == false
                    ).size /
                      100) *
                      75
                  ),
                },
                function (err) {
                  if (err) {
                    console.error(err);
                    error.sendError(err);
                    return;
                  }
                }
              );
              Guild.updateOne(
                { guildID: int.guild.id },
                { $push: { musicBotSkipVotedMembersID: int.user.id } },
                (err, result) => {
                  if (err) {
                    console.error(err);
                    error.sendError(err);
                    return;
                  }
                }
              );
              if (
                int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")
              ) {
                followReply(int, {
                  content: template(
                    LMessages.music.skip.voting,
                    {
                      prefix: prefix,
                      needed: Math.floor(
                        (int.member.voice.channel.members.filter(
                          (m) => m.user.bot == false
                        ).size /
                          100) *
                          75
                      ),
                    },
                    { before: "%", after: "%" }
                  ),
                });
              }
            }
          } else {
            if (int.options.get("count").value) {
              var number = isNaN(Number(int.options.get("count").value))
                ? false
                : Number(int.options.get("count").value);
              if (number > 0) {
                let song1 = serverQueue.songs.shift();
                if (number != 1) {
                  serverQueue.songs.splice(0, number - 1);
                }
                serverQueue.songs = [song1].concat(serverQueue.songs);
              } else {
                if (
                  int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")
                ) {
                  followReply(int, { content: LMessages.music.invalidNumber });
                }
                return;
              }
            }
            if (serverQueue) {
              if (serverQueue.audioPlayer) {
                serverQueue.audioPlayer.stop();
              }
            }
            if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
              followReply(int, { content: LMessages.music.skip.skipped });
            }
          }
        }
      );
    }
  },
};
