const Discord = require("discord.js");
const Guild = require("../models/guild.js");
const error = require("../utils/error");
const template = require("string-placeholder");
const emojiRegex = require("emoji-regex");
const functions = require("../utils/functions");
const LMessages = require(`../messages/`);

module.exports = {
  name: "reactionroles",
  cooldown: 3,
  aliases: ["rr"],
  category: "reactionroles",
  execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (
      !message.channel
        .permissionsFor(message.guild.members.me)
        .has(Discord.PermissionFlagsBits.SendMessages)
    )
      return;

    var content = "";
    let msgsToDel = [];
    var completed = false;
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
      message.member.permissions.has(
        Discord.PermissionFlagsBits.Administrator
      ) ||
      message.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)
    ) {
      if (
        message.guild.members.me.permissions.has(
          Discord.PermissionFlagsBits.ManageRoles
        )
      ) {
        if (args[0] == "create") {
          msgsToDel.push(message);

          message.channel.send(LMessages.rr.typeInContent).then((conMess) => {
            msgsToDel.push(conMess);

            const filter = (mm) => mm.author == message.author;
            const collector1 = conMess.channel
              .createMessageCollector(filter, { time: 300000 })
              .on("collect", (conMsg) => {
                collector1.stop();
                msgsToDel.push(conMsg);

                if (conMsg.content.toLowerCase() == "cancel") {
                  completed = true;
                  functions.deleteMessages(msgsToDel);
                  return;
                } else {
                  content = conMsg.content;

                  message.channel.send(LMessages.rr.typeInEmoji).then((fas) => {
                    emojiMet(fas);
                    return;
                  });

                  function emojiMet(messageForCollecting) {
                    msgsToDel.push(messageForCollecting);

                    const filter = (mm) => mm.author == message.author;
                    const collector2 = messageForCollecting.channel
                      .createMessageCollector(filter, { time: 300000 })
                      .on("collect", async (m) => {
                        msgsToDel.push(m);

                        collector2.stop();
                        if (m.content.toLowerCase() == "cancel") {
                          completed = true;
                          return;
                        } else if (m.content.toLowerCase() == "done") {
                          var Gres = await Guild.findOne({
                            guildID: m.guild.id,
                          });
                          message.channel
                            .send(content)
                            .then(async (finalMess) => {
                              rrConstructor.messageID = finalMess.id;
                              rrConstructor.channelID = finalMess.channel.id;
                              reactionEmojis.forEach((e) => {
                                rrConstructor.emojis.push(e);
                              });
                              reactionRoleIDs.forEach((e) => {
                                rrConstructor.roleIDs.push(e);
                              });

                              functions.addReactions(finalMess, reactionEmojis);

                              await Guild.updateOne(
                                { guildID: finalMess.guild.id },
                                { $push: { rrMessages: rrConstructor } }
                              );

                              completed = true;

                              functions.deleteMessages(msgsToDel);
                            });
                        } else {
                          if (
                            m.content.match(regexEmoji) ||
                            m.content.match(regexEmoji2)
                          ) {
                            m.channel
                              .send(
                                template(
                                  LMessages.rr.typeInRole,
                                  { emoji: m.content },
                                  { before: "%", after: "%" }
                                )
                              )
                              .then((rMes) => {
                                roleMet(rMes, m.content);
                              });
                          } else {
                            m.channel
                              .send(LMessages.rr.invalidEmoji)
                              .then((messs) => {
                                emojiMet(messs);
                                return;
                              });
                          }
                        }
                      })
                      .on("end", (collected) => {
                        if (completed == true) {
                          functions.deleteMessages(msgsToDel);
                          return;
                        }
                      });
                  }

                  function roleMet(messageForCollecting, emoji) {
                    msgsToDel.push(messageForCollecting);

                    const filter = (mm) => mm.author == message.author;
                    const collector3 = messageForCollecting.channel
                      .createMessageCollector(filter, { time: 300000 })
                      .on("collect", async (m) => {
                        msgsToDel.push(m);

                        collector3.stop();
                        if (m.content.toLowerCase() == "cancel") {
                          completed = true;
                          return;
                        } else if (m.content.toLowerCase() == "done") {
                          var Gres = await Guild.findOne({
                            guildID: m.guild.id,
                          });

                          message.channel
                            .send(content)
                            .then(async (finalMess) => {
                              rrConstructor.messageID = finalMess.id;
                              rrConstructor.channelID = finalMess.channel.id;
                              rrConstructor.emojis = reactionEmojis;
                              rrConstructor.roleIDs = reactionRoleIDs;

                              functions.addReactions(finalMess, reactionEmojis);

                              await Guild.updateOne(
                                { guildID: finalMess.guild.id },
                                { $push: { rrMessages: rrConstructor } }
                              );

                              completed = true;

                              functions.deleteMessages(msgsToDel);
                            });
                        } else {
                          if (m.mentions.roles.size >= 1) {
                            let role = m.guild.roles.cache.get(
                              m.mentions.roles.values().next().value.id
                            );

                            if (
                              m.guild.members.me.roles.highest.comparePositionTo(
                                role
                              ) > 0
                            ) {
                              reactionRoleIDs.push(
                                m.mentions.roles.values().next().value.id
                              );

                              reactionEmojis.push(emoji);

                              if (reactionEmojis.length > 0) {
                                m.channel
                                  .send(LMessages.rr.typeInNextEmoji)
                                  .then((fasd) => {
                                    emojiMet(fasd);
                                  });
                              } else {
                                m.channel
                                  .send(LMessages.rr.typeInEmoji)
                                  .then((fasd) => {
                                    emojiMet(fasd);
                                  });
                              }
                            } else {
                              m.channel
                                .send(LMessages.rr.botCannotAddThisRole)
                                .then((mss) => {
                                  roleMet(mss, emoji);
                                  return;
                                });
                            }
                          } else {
                            m.channel
                              .send(LMessages.rr.invalidRole)
                              .then((rMes) => {
                                roleMet(rMes, emoji);
                                return;
                              });
                          }
                        }
                      })
                      .on("end", (collected) => {
                        if (completed == true) {
                          functions.deleteMessages(msgsToDel);
                          return;
                        }
                      });
                  }
                }
              })
              .on("end", (collected) => {
                if (completed == true) {
                  functions.deleteMessages(msgsToDel);
                  return;
                }
              });
          });
        }
      } else {
        message.channel.send(LMessages.rr.botHasNoPermission);
      }
    } else {
      message.channel.send(LMessages.noPermission);
    }
  },
};
