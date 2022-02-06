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
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "resume",
  cooldown: 1,
  aliases: [],
  category: "music",
  async execute(int, serverQueue, Gres) {
    if (!int.member.voice.channel) {
      if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
        followReply(int, { content: LMessages.music.need.toBeInVoice });
      }
      return;
    }
    if (!serverQueue) {
      if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
        followReply(int, { content: LMessages.musicNothingPlaying });
      }
      return;
    }
    await Guild.updateOne(
      {
        guildID: int.guild.id,
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

    if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
      followReply(int, { content: LMessages.music.otherCmds.resume });
    }
  },
};
