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
const template = require("string-placeholder");

module.exports = {
  name: "skip",
  cooldown: 3,
  aliases: ["fs", "forceskip"],
  category: "music",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (
      !message.member.voice.channel ||
      message.member.voice.channel != message.guild.me.voice.channel
    ) {
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.need.toBeInVoiceWithBot);
      }
      return;
    }

    if (!serverQueue) {
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.musicNothingPlaying);
      }
      return;
    }

    let role = message.guild.roles.cache.filter((r) => r.position == 1).first();
    var code = role ? role.id : false;

    let role2 = message.guild.roles.cache.filter((r) => r.name == "DJ").first();
    var code2 = role2 ? role2.id : false;

    if (isFS == true) {
      if (
        message.member.voice.channel.members.filter((m) => m.user.bot == false)
          .size >= 3
      ) {
        if (
          message.member.permissions.has("MANAGE_CHANNELS") ||
          message.member.roles.cache.has(code) ||
          message.member.roles.cache.has(code2)
        ) {
          if (!serverQueue) {
            if (
              message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            ) {
              message.channel.send(LMessages.musicEmptyQueue);
            }
            return;
          }
          if (
            message.channel
              .permissionsFor(message.guild.me)
              .has("SEND_MESSAGES")
          ) {
            message.channel.send(LMessages.music.skip.FSkipped);
          }

          if (args[0]) {
            var number = isNaN(Number(args[0])) ? false : Number(args[0]);
            if (number > 0) {
              if (number != 1) {
                let song1 = serverQueue.songs.shift();
                serverQueue.songs.splice(0, number - 1);
                serverQueue.songs = [song1].concat(serverQueue.songs);
              }
            } else {
              if (
                message.channel
                  .permissionsFor(message.guild.me)
                  .has("SEND_MESSAGES")
              ) {
                message.channel.send(LMessages.music.invalidNumber);
              }
              return;
            }
          }

          if (serverQueue) {
            if (serverQueue.audioPlayer) {
              serverQueue.audioPlayer.stop();
            }
          }

          await Guild.updateOne(
            {
              guildID: message.guild.id,
            },
            {
              musicBotSkipVotedMembersID: [],
              musicBotSkipVotesNeeded: 0,
            }
          );
        } else {
          if (!role) {
            if (
              message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            ) {
              message.channel.send(LMessages.music.skip.FSNoPermission);
            }
            return;
          } else {
            if (
              message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            ) {
              message.channel.send(
                template(
                  LMessages.music.skip.FSNoPermission2,
                  { role: role.name },
                  { before: "%", after: "%" }
                )
              );
            }
            return;
          }
        }
      } else {
        if (args[0]) {
          var number = isNaN(Number(args[0])) ? false : Number(args[0]);
          if (number > 0) {
            if (number != 1) {
              let song1 = serverQueue.songs.shift();
              serverQueue.songs.splice(0, number - 1);
              serverQueue.songs = [song1].concat(serverQueue.songs);
            }
          } else {
            if (
              message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            ) {
              message.channel.send(LMessages.music.invalidNumber);
            }
            return;
          }
        }
        if (serverQueue) {
          if (serverQueue.audioPlayer) {
            serverQueue.audioPlayer.stop();
          }
        }
        if (
          message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
        ) {
          message.channel.send(LMessages.music.skip.skipped);
        }
        await Guild.updateOne(
          {
            guildID: message.guild.id,
          },
          {
            musicBotSkipVotedMembersID: [],
            musicBotSkipVotesNeeded: 0,
          }
        );
      }
    } else {
      if (!serverQueue) {
        if (
          message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
        ) {
          message.channel.send(LMessages.musicEmptyQueue);
        }
        return;
      }
      var Gres = await Guild.findOne({
        guildID: message.guild.id,
      });
      if (
        message.member.voice.channel.members.filter((m) => m.user.bot == false)
          .size >= 3
      ) {
        if (Gres.musicBotSkipVotedMembersID.length != 0) {
          if (Gres.musicBotSkipVotedMembersID.includes(message.author.id)) {
            if (
              message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            ) {
              message.channel.send(LMessages.music.skip.alreadyVoted);
            }
            return;
          }
          await Guild.updateOne(
            { guildID: message.guild.id },
            { $push: { musicBotSkipVotedMembersID: message.author.id } }
          );

          var Gres = await Guild.findOne({
            guildID: message.guild.id,
          });

          if (
            Gres.musicBotSkipVotedMembersID.length >=
            Gres.musicBotSkipVotesNeeded
          ) {
            if (
              message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            ) {
              message.channel.send(LMessages.music.skip.skipped);
            }
            var number = Gres.musicBotSkipSongs;
            if (number > 0) {
              if (number != 1) {
                let song1 = serverQueue.songs.shift();
                serverQueue.songs.splice(0, number - 1);
                serverQueue.songs = [song1].concat(serverQueue.songs);
              }
            }

            if (serverQueue) {
              if (serverQueue.audioPlayer) {
                serverQueue.audioPlayer.stop();
              }
            }

            await Guild.updateOne(
              {
                guildID: message.guild.id,
              },
              {
                musicBotSkipVotedMembersID: [],
                musicBotSkipVotesNeeded: 0,
              }
            );
          } else {
            if (
              message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            ) {
              message.channel.send(
                template(
                  LMessages.music.skip.newSkip,
                  {
                    voted: Gres.musicBotSkipVotedMembersID.length,
                    needed: Gres.musicBotSkipVotesNeeded,
                  },
                  { before: "%", after: "%" }
                )
              );
            }
          }
        } else {
          var number = isNaN(Number(args[0])) ? false : Number(args[0]);
          if (args[0]) {
            if (!(number > 0)) {
              if (
                message.channel
                  .permissionsFor(message.guild.me)
                  .has("SEND_MESSAGES")
              ) {
                message.channel.send(LMessages.music.invalidNumber);
              }
              return;
            }
          }
          await Guild.updateOne(
            {
              guildID: message.guild.id,
            },
            {
              musicBotSkipSongs: number ? 0 : number,
              musicBotSkipVotesNeeded: Math.floor(
                (message.member.voice.channel.members.filter(
                  (m) => m.user.bot == false
                ).size /
                  100) *
                  75
              ),
            }
          );
          await Guild.updateOne(
            { guildID: message.guild.id },
            { $push: { musicBotSkipVotedMembersID: message.author.id } }
          );
          if (
            message.channel
              .permissionsFor(message.guild.me)
              .has("SEND_MESSAGES")
          ) {
            message.channel.send(
              template(
                LMessages.music.skip.voting,
                {
                  prefix: prefix,
                  needed: Math.floor(
                    (message.member.voice.channel.members.filter(
                      (m) => m.user.bot == false
                    ).size /
                      100) *
                      75
                  ),
                },
                { before: "%", after: "%" }
              )
            );
          }
        }
      } else {
        if (args[0]) {
          var number = isNaN(Number(args[0])) ? false : Number(args[0]);
          if (number > 0) {
            let song1 = serverQueue.songs.shift();
            if (number != 1) {
              serverQueue.songs.splice(0, number - 1);
            }
            serverQueue.songs = [song1].concat(serverQueue.songs);
          } else {
            if (
              message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            ) {
              message.channel.send(LMessages.music.invalidNumber);
            }
            return;
          }
        }
        if (serverQueue) {
          if (serverQueue.audioPlayer) {
            serverQueue.audioPlayer.stop();
          }
        }
        if (
          message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
        ) {
          message.channel.send(LMessages.music.skip.skipped);
        }
      }
    }
  },
};
