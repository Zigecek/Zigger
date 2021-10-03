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

const { bot } = require("../bot");
const functions = require("../utils/functions");
const error = require("./error");
const Guild = require("../models/guild");

bot.on("ready", () => {
  console.log(" ");
  console.log("RR - Reaguji.");
});

bot.on("messageReactionAdd", async (react, user) => {
  let reaction;
  if (react.partial) {
    reaction = await react.fetch();
  } else {
    reaction = react;
  }
  if (user == bot.user) {
    return;
  }
  Guild.findOne(
    {
      guildID: reaction.message.guild.id,
    },
    async (err, Gres) => {
      if (err) {
        console.error(err);
        error.sendError(err);
        return;
      }
      let emoji2 = "";
      if (reaction.emoji.id == null) {
        emoji2 = reaction.emoji.name;
      } else {
        emoji2 = "<:" + reaction.emoji.name + ":" + reaction.emoji.id + ">";
      }

      Gres.rrMessages.forEach(async (e) => {
        if (e.messageID == reaction.message.id) {
          if (e.emojis.includes(emoji2)) {
            var index = e.emojis.indexOf(emoji2);
            let member = await reaction.message.guild.members.fetch(user);
            let role = reaction.message.guild.roles.cache.get(e.roleIDs[index]);
            if (role) {
              if (member) {
                if (reaction.message.guild.me.permissions.has("MANAGE_ROLES")) {
                  member.roles.add(role);
                }
              }
            }
          }
        } else {
          return;
        }
      });
    }
  );
});

bot.on("messageReactionRemove", async (react, user) => {
  let reaction;
  if (react.partial) {
    reaction = await react.fetch();
  } else {
    reaction = react;
  }
  Guild.findOne(
    {
      guildID: reaction.message.guild.id,
    },
    async (err, Gres) => {
      if (err) {
        console.error(err);
        error.sendError(err);
        return;
      }
      let emoji2 = "";
      if (reaction.emoji.id == null) {
        emoji2 = reaction.emoji.name;
      } else {
        emoji2 = "<:" + reaction.emoji.name + ":" + reaction.emoji.id + ">";
      }

      Gres.rrMessages.forEach(async (e) => {
        if (e.messageID == reaction.message.id) {
          if (e.emojis.includes(emoji2)) {
            if (user == bot.user) {
              functions.addReactions(reaction.message, e.emojis);
            } else {
              var index = e.emojis.indexOf(emoji2);
              let member = await reaction.message.guild.members.fetch(user);
              let role = reaction.message.guild.roles.cache.get(
                e.roleIDs[index]
              );
              if (role) {
                if (member) {
                  if (member.roles.cache.has(role.id)) {
                    if (
                      reaction.message.guild.me.permissions.has("MANAGE_ROLES")
                    ) {
                      member.roles.remove(role);
                    }
                  }
                }
              }
            }
          }
        } else {
          return;
        }
      });
    }
  );
});

bot.on("messageDelete", async (message) => {
  Guild.findOne(
    {
      guildID: message.guild.id,
    },
    (err, Gres) => {
      if (err) {
        console.error(err);
        error.sendError(err);
        return;
      }

      Gres.rrMessages.forEach((e) => {
        if (e.messageID == message.id) {
          Guild.findOneAndUpdate(
            { guildID: message.guild.id },
            { $pull: { rrMessages: e } },
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
    }
  );
});
