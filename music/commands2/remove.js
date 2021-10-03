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

const template = require("string-placeholder");
const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "remove",
  cooldown: 3,
  aliases: ["rm"],
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

    var pageNum = int.options.get("index") ? Number(int.options.get("index")?.value) : NaN;

    if (!isNaN(pageNum)) {
      if (pageNum > 0) {
        if (serverQueue.songs[pageNum]) {
          if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
            followReply(int, {
              content: template(
                LMessages.music.remove.removed,
                {
                  title:
                    serverQueue.songs[pageNum]
                      .title,
                },
                { before: "%", after: "%" }
              ),
            });
          }
          serverQueue.songs.splice(pageNum, 1);
        } else {
          if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
            followReply(int, { content: LMessages.music.remove.songNotExist });
          }
          return;
        }
      } else {
        if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
          followReply(int, { content: LMessages.music.remove.invalidNumber });
        }
        return;
      }
    } else {
      if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
        followReply(int, { content: LMessages.music.remove.use });
      }
      return;
    }
  },
};
