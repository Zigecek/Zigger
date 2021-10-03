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
const { bot } = require("../../bot");
const template = require("string-placeholder");
const config = require("../../config.json");
const LMessages = require(`../../messages/`);

module.exports = {
  name: "queue",
  cooldown: 2,
  aliases: ["q"],
  category: "music",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
      return;
    if (!message.guild.me.permissions.has("EMBED_LINKS"))
      return message.channel.send(LMessages.help.noPermission);
    if (!serverQueue) {
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.musicEmptyQueue);
      }
      return;
    }

    let pages = [];
    var pageConstructor = "";
    serverQueue.songs.forEach((song, index) => {
      var pageIndex = parseInt(index / 10);
      if (!pages[pageIndex]) {
        if (index == 0) {
          pageConstructor = `${LMessages.music.queue.playing}\n [${song.title}](${song.url}) - \`${song.duration}\`\n`;
          if (serverQueue.songs.length > 1) {
            pageConstructor = `${pageConstructor}\n${LMessages.music.queue.nextInQueue}`;
          }
        } else {
          pageConstructor = `**${index}.** [${song.title}](${song.url}) - \`${song.duration}\``;
        }
        pages.push(pageConstructor);
      } else {
        if (index == 0) {
          if (serverQueue.songs.length > 1) {
            pages[
              pageIndex
            ] = `${pages[pageIndex]}\n${LMessages.music.queue.playing}\n [${song.title}](${song.url}) - \`${song.duration}\`\n\n${LMessages.music.queue.nextInQueue}\n`;
          } else {
            pages[
              pageIndex
            ] = `${pages[pageIndex]}\n${LMessages.music.queue.playing}\n [${song.title}](${song.url}) - \`${song.duration}\``;
          }
        } else {
          pages[
            pageIndex
          ] = `${pages[pageIndex]}\n**${index}.** [${song.title}](${song.url}) - \`${song.duration}\``;
        }
      }
    });

    if (args[0] == null) {
      const Embed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setTitle(LMessages.music.queue.queue)
        .setAuthor(config.name, config.avatarUrl, config.webUrl)
        .setDescription(`${pages[0]}`)
        .setFooter(
          template(
            LMessages.music.queue.footer,
            {
              page: 1,
              pages: pages.length,
              loop: Gres.musicBotLoop ? "✔️" : "❌",
              qloop: Gres.musicBotQueueLoop ? "✔️" : "❌",
            },
            {
              before: "%",
              after: "%",
            }
          ) +
            "\n" +
            LMessages.music.queue.anotherPageUse
        );
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send({ embeds: [Embed] });
      }
    } else if (args[0] == "clear") {
      bot.commands
        .get("clearqueue")
        .execute(message, serverQueue, args, Gres, prefix, command, isFS);
      return;
    } else if (args[0] == "loop") {
      bot.commands
        .get("queueloop")
        .execute(message, serverQueue, args, Gres, prefix, command, isFS);
      return;
    } else if (Number(args[0])) {
      var number = Number(args[0]);

      if (number > pages.length) {
        if (
          message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
        ) {
          message.channel.send(LMessages.music.queue.invalidPage);
        }
        return;
      }
      const Embed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setTitle(LMessages.music.queue.queue)
        .setAuthor(config.name, config.avatarUrl, config.webUrl)
        .setDescription(`${pages[number - 1]}`)
        .setFooter(
          template(
            LMessages.music.queue.footer,
            {
              page: number,
              pages: pages.length,
              loop: Gres.musicBotLoop ? "✔️" : "❌",
              qloop: Gres.musicBotQueueLoop ? "✔️" : "❌",
            },
            {
              before: "%",
              after: "%",
            }
          ) +
            "\n" +
            LMessages.music.queue.anotherPageUse
        );
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send({ embeds: [Embed] });
      }
    } else {
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.queue.invalidNumber);
      }
      return;
    }
  },
};
