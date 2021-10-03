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

const Guild = require("../models/guild.js");
const template = require("string-placeholder");
const error = require("../utils/error");
const LMessages = require(`../messages/`);

module.exports = {
  name: "settings",
  cooldown: 3,
  aliases: [],
  category: "settings",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      if (args[0] == "defaultvolume") {
        if (args[1]) {
          if (Number(args[1]) >= 1 && Number(args[1]) <= 100) {
            Guild.findOneAndUpdate(
              {
                guildID: message.guild.id,
              },
              {
                musicBotDefaultVolume: Number(args[1]),
                musicBotVolume: Number(args[1]),
              },
              function (err) {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }
              }
            );
            message.channel.send(
              template(
                LMessages.settings.dvol.set,
                { vol: args[1] },
                { before: "%", after: "%" }
              )
            );
            return;
          } else {
            message.channel.send(LMessages.settings.dvol.invNumber);
            return;
          }
        } else {
          template(
            LMessages.settings.dvol.vol,
            { vol: Gres.musicBotDefaultVolume },
            { before: "%", after: "%" }
          );
          return;
        }
      } else if (args[0] == "blacklist") {
        if (message.mentions.channels.size >= 1) {
          message.mentions.channels.each((ch) => {
            if (Gres.blacklist.includes(ch.id)) {
              Guild.updateOne(
                {
                  guildID: message.guild.id,
                },
                {
                  $pull: { blacklist: ch.id },
                },
                (err) => {
                  if (err) {
                    console.error(err);
                    error.sendError(err);
                    return;
                  }
                }
              );
            } else {
              Guild.updateOne(
                {
                  guildID: message.guild.id,
                },
                {
                  $push: { blacklist: ch.id },
                },
                (err) => {
                  if (err) {
                    console.error(err);
                    error.sendError(err);
                    return;
                  }
                }
              );
            }
          });
          message.channel.send(LMessages.settings.blacklist.succesful);
          return;
        } else {
          message.channel.send(LMessages.settings.blacklist.mustMention);
          return;
        }
      } else if (args[0] == "annouce") {
        if (args[1]) {
          if (["on", "yes", "off", "no", "short", "small"].includes(args[1])) {
            Guild.findOneAndUpdate(
              {
                guildID: message.guild.id,
              },
              {
                annouce:
                  args[1] == "on" || args[1] == "yes"
                    ? 1
                    : args[1] == "no" || args[1] == "off"
                    ? 0
                    : args[1] == "short" || args[1] == "small"
                    ? 3
                    : 1,
              },
              function (err) {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }
              }
            );
            message.channel.send(
              template(
                LMessages.settings.annouce.set,
                { mode: args[1] },
                { before: "%", after: "%" }
              )
            );
          } else {
            message.channel.send(LMessages.settings.annouce.use);
            return;
          }
        } else {
          message.channel.send(
            template(
              LMessages.settings.annouce.mode,
              {
                mode:
                  Gres.annouce == 1
                    ? "on"
                    : Gres.annouce == 0
                    ? "off"
                    : "short",
              },
              { before: "%", after: "%" }
            )
          );
          return;
        }
      } else {
        message.channel.send(LMessages.settings.useHelp);
        return;
      }
    } else {
      message.channel.send(LMessages.noPermission);
    }
  },
};
