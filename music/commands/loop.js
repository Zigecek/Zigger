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
  name: "loop",
  cooldown: 2,
  aliases: [],
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

    Guild.findOneAndUpdate(
      {
        guildID: message.guild.id,
      },
      {
        musicBotLoop: !Gres.musicBotLoop,
      },
      function (err) {
        if (err) {
          console.error(err);
          error.sendError(err);
          return;
        }
      }
    );

    if (Gres.musicBotLoop == true) {
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.loop.disabled);
      }
    } else if (Gres.musicBotLoop == false) {
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.loop.enabled);
      }
    }
  },
};
