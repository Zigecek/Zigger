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
const Guild = require("../../models/guild");
const LMessages = require(`../../messages/`);

module.exports = {
  name: "queueloop",
  cooldown: 2,
  aliases: ["loopqueue"],
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
    }

    if (!serverQueue) {
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.musicNothingPlaying);
      }
      return;
    }

    Guild.findOneAndUpdate(
      {
        guildID: message.guild.id,
      },
      {
        musicBotQueueLoop: !Gres.musicBotQueueLoop,
      },
      function (err) {
        if (err) {
          console.error(err);
          error.sendError(err);
          return;
        }
      }
    );

    if (Gres.musicBotQueueLoop == true) {
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.loop.queue.disabled);
      }
    } else if (Gres.musicBotQueueLoop == false) {
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.loop.queue.enabled);
      }
    }
  },
};
