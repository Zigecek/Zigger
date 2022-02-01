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
const { followReply } = require("../utils/functions");
const functions = require("../utils/functions");

module.exports = {
  name: "autorole",
  cooldown: 2,
  aliases: [],
  category: "moderation",
  async execute(int, serverQueue, Gres) {
    if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) return;
    if (
      int.member.permissions.has("ADMINISTRATOR") ||
      int.member.permissions.has("MANAGE_ROLES")
    ) {
      if (int.options.getSubcommand() == "add") {
        var ar = [];
        var roleAr = Gres.autoRoleIDs;
        for (var i = 1; i <= 9; i++) {
          var role = int.options.getRole(`role${i}`);
          if (!role) break;
          if (role.position == 0) break;
          roleAr.push(role.id);
          ar.push(role.id);
        }
        roleAr = functions.filterDuplicates(roleAr);
        await Guild.updateOne(
          {
            guildID: int.guild.id,
          },
          {
            autoRoleIDs: roleAr,
          }
        );
        if (ar.length == 0) {
          followReply(int, {
            content: LMessages.autoroleNotFoundOrNoMention,
          });
          return;
        }
        followReply(int, {
          content: template(
            LMessages.autoroleAdd,
            {
              roles: ar.map((x) => `\n <@&${x}>`),
            },
            { before: "%", after: "%" }
          ),
        });
      } else if (int.options.getSubcommand() == "on") {
        await Guild.updateOne(
          {
            guildID: int.guild.id,
          },
          {
            autoroleEnabled: true,
          }
        );

        followReply(int, { content: LMessages.autorole.enabled });

        if (Gres.autoRoleIDs.length < 1) {
          followReply(int, {
            content: LMessages.autorole.enabledButNotSet,
          });
        }
      } else if (int.options.getSubcommand() == "off") {
        await Guild.updateOne(
          {
            guildID: int.guild.id,
          },
          {
            autoroleEnabled: false,
          }
        );

        followReply(int, { content: LMessages.autorole.disabled });
      } else if (int.options.getSubcommand() == "remove") {
        var ar = [];
        var roleAr = Gres.autoRoleIDs;
        for (var i = 1; i <= 9; i++) {
          var role = int.options.getRole(`role${i}`);
          if (!role) break;
          if (role.position == 0) break;
          roleAr.splice(roleAr.indexOf(role.id), 1);
          ar.push(role.id);
        }
        roleAr = functions.filterDuplicates(roleAr);
        await Guild.updateOne(
          {
            guildID: int.guild.id,
          },
          {
            autoRoleIDs: roleAr,
          }
        );
        if (ar.length == 0) {
          followReply(int, {
            content: LMessages.autoroleNotFoundOrNoMention,
          });
          return;
        }
        followReply(int, {
          content: template(
            LMessages.autoroleRemove,
            {
              roles: ar.map((x) => `\n <@&${x}>`),
            },
            { before: "%", after: "%" }
          ),
        });
      } else if (int.options.getSubcommand() == "info") {
        if (Gres.autoRoleIDs.length >= 1) {
          var roles = [];
          Gres.autoRoleIDs.forEach(async (id) => {
            var role = int.guild.roles.cache.get(id);
            if (role) {
              roles.push(role);
            } else {
              await Guild.updateOne(
                {
                  guildID: int.guild.id,
                },
                {
                  $pull: { autoRoleIDs: id },
                }
              );
            }
          });
          followReply(int, {
            content: template(
              LMessages.autoroleInfo,
              { roles: roles.map((r) => `\n <@&${r.id}> `) },
              { before: "%", after: "%" }
            ),
          });
        } else {
          followReply(int, { content: LMessages.autoroleNotSet });
        }
      }
    } else {
      followReply(int, { content: LMessages.noPermission });
    }
  },
};
