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
const botFile = require("../bot");
const error = require("../utils/error");
const template = require("string-placeholder");
const LMessages = require(`../messages/`);

module.exports = {
  name: "autorole",
  cooldown: 2,
  aliases: [],
  category: "moderation",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
      return;
    if (
      message.member.permissions.has("ADMINISTRATOR") ||
      message.member.permissions.has("MANAGE_ROLES")
    ) {
      if (args[0] == "add") {
        if (args[1] != null) {
          if (message.mentions.roles.size >= 1) {
            var ar = [];
            message.mentions.roles.forEach((role) => {
              if (role.position == 0) return;
              Guild.updateOne(
                {
                  guildID: message.guild.id,
                },
                {
                  $push: { autoRoleIDs: role.id },
                },
                (err, result) => {
                  if (err) {
                    console.error(err);
                    error.sendError(err);
                    return;
                  }
                }
              );
              ar.push(role.id);
            });

            message.channel.send(
              template(
                LMessages.autoroleAdd,
                { roles: ar.map((x) => `\n <@&${x}>`) },
                { before: "%", after: "%" }
              )
            );
          } else {
            message.channel.send(LMessages.autoroleNotFoundOrNoMention);
          }
        } else {
          message.channel.send(LMessages.autoroleUse);
          return;
        }
      } else if (args[0] == "on") {
        Guild.findOneAndUpdate(
          {
            guildID: message.guild.id,
          },
          {
            autoroleEnabled: true,
          },
          function (err) {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }

            message.channel.send(LMessages.autorole.enabled);

            if (Gres.autoRoleIDs.length < 1) {
              message.channel.send(LMessages.autorole.enabledButNotSet);
            }
          }
        );
      } else if (args[0] == "off") {
        Guild.findOneAndUpdate(
          {
            guildID: message.guild.id,
          },
          {
            autoroleEnabled: false,
          },
          function (err) {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }

            message.channel.send(LMessages.autorole.disabled);
          }
        );
      } else {
        if (Gres.autoRoleIDs.length >= 1) {
          var roles = [];
          Gres.autoRoleIDs.forEach((id) => {
            var role = message.guild.roles.cache.get(id);
            if (role) {
              roles.push(role);
            } else {
              Guild.findOneAndUpdate(
                {
                  guildID: message.guild.id,
                },
                {
                  $pull: { autoRoleIDs: id },
                },
                (err, res) => {
                  if (err) {
                    console.error(err);
                    error.sendError(err);
                    return;
                  }
                }
              );
            }
          });
          message.channel.send(
            template(
              LMessages.autoroleInfo,
              { role: roles.map((r) => `\n <@&${r.id}> `) },
              { before: "%", after: "%" }
            )
          );
        } else {
          message.channel.send(LMessages.autoroleNotSet);
        }
      }
    } else {
      message.channel.send(LMessages.noPermission);
    }
  },
};
