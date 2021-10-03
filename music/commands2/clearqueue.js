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

const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "clearqueue",
  cooldown: 2,
  aliases: ["queueclear"],
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

    serverQueue.songs.splice(1, serverQueue.songs.length - 1);

    if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
      followReply(int, { content: LMessages.music.queue.cleared });
    }
  },
};
