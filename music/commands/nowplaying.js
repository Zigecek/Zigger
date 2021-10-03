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

module.exports = {
  name: "nowplaying",
  cooldown: 3,
  aliases: ["np", "playing"],
  category: "music",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    const start = "╞";
    const end = "╡";
    const prog = "═";
    const curs = "🔘";
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
      return;
    if (serverQueue) {
      const fourPer = serverQueue.songs[0].sDur / 25;
      const elSecs = Math.floor(
        (new Date().getTime() - Gres.musicBotPlayTime.getTime()) / 1000
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
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        if (message.guild.me.permissions.has("EMBED_LINKS")) {
          message.channel.send({ embeds: [Embed] });
        } else {
          message.channel.send(
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
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.musicNothingPlaying);
      }
    }
  },
};
