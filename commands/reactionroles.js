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

module.exports = {
  name: "reactionroles",
  cooldown: 3,
  aliases: ["rr"],
  category: "reactionroles",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
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
      message.member.permissions.has("ADMINISTRATOR") ||
      message.member.permissions.has("MANAGE_ROLES")
    ) {
      if (message.guild.me.permissions.has("MANAGE_ROLES")) {
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
                      .on("collect", (m) => {
                        msgsToDel.push(m);

                        collector2.stop();
                        if (m.content.toLowerCase() == "cancel") {
                          completed = true;
                          return;
                        } else if (m.content.toLowerCase() == "done") {
                          Guild.findOne(
                            {
                              guildID: m.guild.id,
                            },
                            (err, Gres) => {
                              if (err) {
                                console.error(err);
                                error.sendError(err);
                                return;
                              }

                              message.channel
                                .send(content)
                                .then((finalMess) => {
                                  rrConstructor.messageID = finalMess.id;
                                  rrConstructor.channelID =
                                    finalMess.channel.id;
                                  reactionEmojis.forEach((e) => {
                                    rrConstructor.emojis.push(e);
                                  });
                                  reactionRoleIDs.forEach((e) => {
                                    rrConstructor.roleIDs.push(e);
                                  });

                                  functions.addReactions(
                                    finalMess,
                                    reactionEmojis
                                  );

                                  Guild.updateOne(
                                    { guildID: finalMess.guild.id },
                                    { $push: { rrMessages: rrConstructor } },
                                    (err, result) => {
                                      if (err) {
                                        console.error(err);
                                        error.sendError(err);
                                        return;
                                      }
                                    }
                                  );

                                  completed = true;

                                  functions.deleteMessages(msgsToDel);
                                });
                            }
                          );
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
                      .on("collect", (m) => {
                        msgsToDel.push(m);

                        collector3.stop();
                        if (m.content.toLowerCase() == "cancel") {
                          completed = true;
                          return;
                        } else if (m.content.toLowerCase() == "done") {
                          Guild.findOne(
                            {
                              guildID: m.guild.id,
                            },
                            (err, Gres) => {
                              if (err) {
                                console.error(err);
                                error.sendError(err);
                                return;
                              }

                              message.channel
                                .send(content)
                                .then((finalMess) => {
                                  rrConstructor.messageID = finalMess.id;
                                  rrConstructor.channelID =
                                    finalMess.channel.id;
                                  rrConstructor.emojis = reactionEmojis;
                                  rrConstructor.roleIDs = reactionRoleIDs;

                                  functions.addReactions(
                                    finalMess,
                                    reactionEmojis
                                  );

                                  Guild.updateOne(
                                    { guildID: finalMess.guild.id },
                                    { $push: { rrMessages: rrConstructor } },
                                    (err, result) => {
                                      if (err) {
                                        console.error(err);
                                        error.sendError(err);
                                        return;
                                      }
                                    }
                                  );

                                  completed = true;

                                  functions.deleteMessages(msgsToDel);
                                });
                            }
                          );
                        } else {
                          if (m.mentions.roles.size >= 1) {
                            let role = m.guild.roles.cache.get(
                              m.mentions.roles.values().next().value.id
                            );

                            if (
                              m.guild.me.roles.highest.comparePositionTo(role) >
                              0
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
