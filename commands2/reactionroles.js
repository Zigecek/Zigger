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
const error = require("../utils/error");
const template = require("string-placeholder");
const emojiRegex = require("emoji-regex");
const functions = require("../utils/functions");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "reactionroles",
  cooldown: 3,
  aliases: ["rr"],
  category: "reactionroles",
  async execute(int, serverQueue, Gres) {
    if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) return;

    var content = "";
    var regexEmoji = /<a:.+?:\d+>|<:.+?:\d+>/;
    var regexEmoji2 = emojiRegex();
    let reactionEmojis = [];
    let reactionRoleIDs = [];

    let rrConstructor = {
      messageID: "",
      channelID: "",
      emojis: [],
      roleIDs: [],
    };

    if (
      int.member.permissions.has("ADMINISTRATOR") ||
      int.member.permissions.has("MANAGE_ROLES")
    ) {
      if (int.guild.me.permissions.has("MANAGE_ROLES")) {
        if (int.options.getSubcommand() == "create") {
          if (!int.options.get("channel").channel) {
            followReply(int, { content: LMessages.rr.invalidChannel });
            return;
          } else {
            rrConstructor.channelID = int.options.get("channel").channel.id;
          }
          content = int.options.get("content").value;

          for (var i = 0; i < 9; i++) {
            const index = (i += 1);
            if (!int.options.get(`role${index}`)?.role) break;
            if (
              !int.options.get(`emoji${index}`)?.value.match(regexEmoji) &&
              !int.options.get(`emoji${index}`)?.value.match(regexEmoji2)
            ) {
              break;
            }
            console.log("afas");
            if (
              int.guild.me.roles.highest.position <
              int.options.get(`role${index}`).role.position
            ) {
              break;
            }
            console.log(":)");

            reactionEmojis.push(int.options.get(`emoji${index}`).value);
            reactionRoleIDs.push(int.options.get(`role${index}`).role.id);
          }

          if (reactionRoleIDs.length == 0 || reactionEmojis.length == 0) {
            followReply(int, { content: LMessages.rr.atLeastOnePair });
            return;
          }

          int.options
            .get("channel")
            .channel.send({ content: content })
            .then((message) => {
              rrConstructor.messageID = message.id;
              rrConstructor.emojis = reactionEmojis;
              rrConstructor.roleIDs = reactionRoleIDs;

              functions.addReactions(message, reactionEmojis);

              followReply(int, {
                content: template(
                  LMessages.rr.succesfulCreated,
                  { url: message.url },
                  { before: "%", after: "%" }
                ),
              });

              Guild.updateOne(
                { guildID: int.guild.id },
                { $push: { rrMessages: rrConstructor } },
                (err) => {
                  if (err) {
                    console.error(err);
                    error.sendError(err);
                    return;
                  }
                }
              );
            });
        }
      } else {
        followReply(int, { content: LMessages.rr.botHasNoPermission });
      }
    } else {
      followReply(int, { content: LMessages.noPermission });
    }
  },
};
