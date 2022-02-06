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
const sec2human = require("sec2human");
const config = require("../../config.json");
const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "nowplaying",
  cooldown: 3,
  aliases: ["np", "playing"],
  category: "music",
  execute(int, serverQueue, Gres) {
    const start = "╞";
    const end = "╡";
    const prog = "═";
    const curs = "🔘";
    if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) return;
    if (serverQueue) {
      const fourPer = serverQueue.songs[0].sDur / 25;
      const elSecs = Math.floor(
        (Date.now() - Gres.musicBotPlayTime.getTime()) / 1000
      );
      const nonElSecs = serverQueue.songs[0].sDur - elSecs;

      const Embed = new Discord.MessageEmbed()
        .setColor(config.colors.red)
        .setTitle(LMessages.musicNowPlaying)
        .setThumbnail(serverQueue.songs[0].thumbnail)
        .addFields(
          {
            name: LMessages.musicName,
            value: `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`,
          },
          {
            name: LMessages.musicAuthor,
            value: serverQueue.songs[0].author,
          }
        );
      if (serverQueue.songs[0].duration == "LIVE!") {
        Embed.addField(LMessages.musicDuration, serverQueue.songs[0].duration);
      } else {
        Embed.addField(
          LMessages.musicProgress,
          sec2human(elSecs) +
            " / " +
            serverQueue.songs[0].duration +
            " " +
            (start +
              prog.repeat(Math.floor(elSecs / fourPer)) +
              curs +
              prog.repeat(Math.floor(nonElSecs / fourPer)) +
              end)
        );
      }
      if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
        if (int.guild.me.permissions.has("EMBED_LINKS")) {
          followReply(int, { embeds: [Embed] });
        } else {
          int.channel.send(
            LMessages.musicNowPlaying +
              "\n" +
              "`" +
              serverQueue.songs[0].title +
              "` (" +
              serverQueue.songs[0].duration +
              ")"
          );
        }
      }
    } else {
      if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
        followReply(int, { content: LMessages.musicNothingPlaying });
      }
    }
  },
};
