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

const Guild = require("../models/guild");
const error = require("../utils/error");
const template = require("string-placeholder");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "channel",
  cooldown: 2,
  aliases: [],
  category: "moderation",
  async execute(int, serverQueue, Gres) {
    if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) return;
    if (
      int.member.permissions.has("ADMINISTRATOR") ||
      int.member.permissions.has("MANAGE_CHANNELS")
    ) {
      if (int.options.getSubcommandGroup() == "wel") {
        if (int.options.getSubcommand() == "info") {
          var Gres = await Guild.findOne({
            guildID: int.guild.id,
          });
          if (Gres.welChannelID == null) {
            followReply(int, { content: LMessages.channels.wel.notSet });
          } else {
            followReply(int, {
              content: template(
                LMessages.channels.wel.whatIs,
                { log: "<#" + Gres.welChannelID + ">" },
                { before: "%", after: "%" }
              ),
            });
          }
        } else if (int.options.getSubcommand() == "set") {
          if (!int.options.get("channel").channel) {
            followReply(int, {
              content: LMessages.channels.notFoundOrNoMention,
            });

            return;
          }
          await Guild.updateOne(
            {
              guildID: int.guild.id,
            },
            {
              welChannelID: int.options.get("channel").channel.id,
            }
          );

          followReply(int, {
            content: template(
              LMessages.channels.wel.set,
              { log: "<#" + int.options.get("channel").channel.id + ">" },
              { before: "%", after: "%" }
            ),
          });
        }
      } else if (int.options.getSubcommandGroup() == "bye") {
        if (int.options.getSubcommand() == "info") {
          var Gres = await Guild.findOne({
            guildID: int.guild.id,
          });
          if (Gres.byeChannelID == null) {
            followReply(int, { content: LMessages.channels.bye.notSet });
          } else {
            followReply(int, {
              content: template(
                LMessages.channels.bye.whatIs,
                { bye: "<#" + Gres.byeChannelID + ">" },
                { before: "%", after: "%" }
              ),
            });
          }
        } else if (int.options.getSubcommand() == "set") {
          if (!int.options.get("channel").channel) {
            followReply(int, {
              content: LMessages.channels.notFoundOrNoMention,
            });

            return;
          }
          await Guild.updateOne(
            {
              guildID: int.guild.id,
            },
            {
              byeChannelID: int.options.get("channel").channel.id,
            }
          );

          followReply(int, {
            content: template(
              LMessages.channels.bye.set,
              { bye: "<#" + int.options.get("channel").channel.id + ">" },
              { before: "%", after: "%" }
            ),
          });
        }
      } else {
      }
    } else {
      followReply(int, { content: LMessages.noPermission });
    }
  },
};
