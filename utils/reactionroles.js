const { bot } = require("../bot");
const functions = require("../utils/functions");
const error = require("./error");
const Guild = require("../models/guild");

const ready = () => {
  console.log(" ");
  console.log("RR - Reaguji.");
};

const messageReactionAdd = async (react, user) => {
  let reaction;
  if (react.partial) {
    reaction = await react.fetch();
  } else {
    reaction = react;
  }
  if (user == bot.user) {
    return;
  }
  var Gres = await Guild.findOne({
    guildID: reaction.message.guild.id,
  });
  let emoji2 =
    reaction.emoji.id == null
      ? reaction.emoji.name
      : "<:" + reaction.emoji.name + ":" + reaction.emoji.id + ">";

  Gres.rrMessages.forEach(async (e) => {
    if (e.messageID == reaction.message.id) {
      if (e.emojis.includes(emoji2)) {
        var index = e.emojis.indexOf(emoji2);
        let member = await reaction.message.guild.members.members.fetch(user);
        let role = await reaction.message.guild.roles.fetch(e.roleIDs[index]);
        if (role) {
          if (member) {
            if (reaction.message.guild.members.me.permissions.has("MANAGE_ROLES")) {
              member.roles.add(role);
            }
          }
        }
      }
    } else {
      return;
    }
  });
};

const messageReactionRemove = async (react, user) => {
  let reaction;
  if (react.partial) {
    reaction = await react.fetch();
  } else {
    reaction = react;
  }
  var Gres = await Guild.findOne({
    guildID: reaction.message.guild.id,
  });
  let emoji2 =
    reaction.emoji.id == null
      ? reaction.emoji.name
      : "<:" + reaction.emoji.name + ":" + reaction.emoji.id + ">";

  Gres.rrMessages.forEach(async (e) => {
    if (e.messageID == reaction.message.id) {
      if (e.emojis.includes(emoji2)) {
        if (user == bot.user) {
          functions.addReactions(reaction.message, e.emojis);
        } else {
          var index = e.emojis.indexOf(emoji2);
          let member = await reaction.message.guild.members.members.fetch(user);
          let role = await reaction.message.guild.roles.fetch(e.roleIDs[index]);
          if (role) {
            if (member) {
              if (member.roles.cache.has(role.id)) {
                if (reaction.message.guild.members.me.permissions.has("MANAGE_ROLES")) {
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
};

const messageDelete = async (message) => {
  var Gres = await Guild.findOne({
    guildID: message.guild.id,
  });

  Gres.rrMessages.forEach(async (e) => {
    if (e.messageID == message.id) {
      await Guild.updateOne(
        { guildID: message.guild.id },
        { $pull: { rrMessages: e } }
      );
    }
  });
};

module.exports = {
  events: {
    ready: ready,
    messageDelete: messageDelete,
    messageReactionRemove: messageReactionRemove,
    messageReactionAdd: messageReactionAdd,
  },
};
