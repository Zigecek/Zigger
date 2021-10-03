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

const error = require("../../utils/error");
const template = require("string-placeholder");
const Guild = require("../../models/guild");
const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "volume",
  cooldown: 2,
  aliases: ["vol"],
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
    if (!int.options.get("volume").value) {
      if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES"))
        return;
      if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
        followReply(int, {
          content: template(
            LMessages.music.volume.currentVolume,
            { volume: Gres.musicBotVolume },
            { before: "%", after: "%" }
          ),
        });
      }
      return;
    } else {
      if (
        Number(int.options.get("volume").value) >= 1 &&
        Number(int.options.get("volume").value) <= 100
      ) {
        Guild.findOneAndUpdate(
          {
            guildID: int.guild.id,
          },
          {
            musicBotVolume: Number(int.options.get("volume").value),
          },
          function (err) {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }

            if (serverQueue != undefined) {
              serverQueue.audioPlayer.state?.resource.volume.setVolume(
                Number(int.options.get("volume").value) / 100
              );
            }

            if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
              followReply(int, {
                content: template(
                  LMessages.music.volume.set,
                  { volume: int.options.get("volume").value },
                  { before: "%", after: "%" }
                ),
              });
            }
            return;
          }
        );
      } else if (Number(int.options.get("volume").value) >= 1 && Gres.plus) {
        Guild.findOneAndUpdate(
          {
            guildID: int.guild.id,
          },
          {
            musicBotVolume: Number(int.options.get("volume").value),
          },
          function (err) {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }

            if (serverQueue != undefined) {
              serverQueue.audioPlayer.state?.resource.volume.setVolume(
                Number(int.options.get("volume").value) / 100
              );
            }

            if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
              followReply(int, {
                content: template(
                  LMessages.music.volume.set,
                  { volume: int.options.get("volume").value },
                  { before: "%", after: "%" }
                ),
              });
            }
            return;
          }
        );
      } else {
        if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
          followReply(int, { content: LMessages.music.volume.use });
        }
      }
    }
  },
};
