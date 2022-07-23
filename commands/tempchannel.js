
const Guild = require("../models/guild.js");
const error = require("../utils/error");
const template = require("string-placeholder");
const LMessages = require(`../messages/`);

module.exports = {
  name: "tempchannel",
  cooldown: 1,
  aliases: ["tc", "tempchan"],
  category: "tempchannel",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (args[0] == "create") {
      if (
        !message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.ManageChannels) ||
        !message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.ManageRoles) ||
        !message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.ViewChannel)
      ) {
        message.channel.send(LMessages.botNoPermission);
        return;
      }

      let his = Gres.tc.filter((x) => x.userID == message.author.id)[0];

      if (his != null || his != undefined) {
        message.channel.send(LMessages.tc.alreadyCreated);

        return;
      }

      let tcConctructor = {
        userID: "",
        channelID: "",
        invitedUserIDs: [],
        joined: false,
      };

      function timer(channel) {
        setTimeout(async () => {
          var Gres = await Guild.findOne({
            guildID: channel.guild.id,
          });
          let tc = Gres.tc.filter((x) => x.channelID == channel.id)[0];

          if (tc != null && tc != [] && tc != undefined) {
            if (tc.joined == false) {
              channel.delete();

              await Guild.updateOne(
                { guildID: channel.guild.id },
                { $pull: { tc: tc } }
              );
            }
          }
        }, 60000);
      }

      function createCategory(name) {
        return new Promise((resolve, reject) => {
          message.guild.channels
            .create(name, {
              type: "GUILD_CATEGORY",
              permissionOverwrites: [
                {
                  id: message.guild.members.me,
                  allow: [Discord.PermissionFlagsBits.ViewChannel],
                  type: "member",
                },
                {
                  id: message.guild.roles.everyone,
                  deny: [Discord.PermissionFlagsBits.ViewChannel],
                  type: "role",
                },
              ],
            })
            .then(async (category) => {
              await Guild.updateOne(
                {
                  guildID: message.guild.id,
                },
                {
                  tcCategoryID: category.id,
                }
              );

              var pos = category.guild.channels.cache
                .filter((x) => x.parentID == null)
                .reduce((a, b) => {
                  if (a.position > b.position) {
                    return a;
                  } else if (b.position > a.position) {
                    return b;
                  } else {
                    return a;
                  }
                }).position;

              category.setPosition(pos + 1);

              resolve(category);
            })
            .catch((err) => {
              if (err) {
                reject(err);
              }
            });
        });
      }

      function createChannel(name, category) {
        return new Promise((resolve, reject) => {
          message.guild.channels
            .create(name, {
              type: "GUILD_VOICE",
              permissionOverwrites: [
                {
                  id: message.guild.roles.everyone,
                  deny: [Discord.PermissionFlagsBits.ViewChannel],
                  type: "role",
                },
                {
                  id: message.member,
                  allow: [Discord.PermissionFlagsBits.ViewChannel],
                  type: "member",
                },
                {
                  id: message.guild.members.me,
                  allow: [Discord.PermissionFlagsBits.ViewChannel],
                  type: "member",
                },
              ],
              parent: category,
            })
            .then(async (channel) => {
              if (message.member.voice.channel) {
                message.member.voice.setChannel(channel);
                tcConctructor.joined = true;
              } else {
                tcConctructor.joined = false;
              }

              tcConctructor.userID = message.author.id;
              tcConctructor.channelID = channel.id;
              tcConctructor.invitedUserIDs = [];

              await Guild.updateOne(
                { guildID: message.guild.id },
                { $push: { tc: tcConctructor } }
              );

              message.channel.send(LMessages.tc.channelCreated);

              timer(channel);

              resolve(channel);
            })
            .catch((err) => {
              if (err) {
                reject(err);
              }
            });
        });
      }

      if (Gres.tcCategoryID) {
        let cat = message.guild.channels.cache.get(Gres.tcCategoryID);
        if (cat) {
          createChannel(
            template(
              LMessages.tc.voiceName,
              { username: message.author.username },
              { before: "%", after: "%" }
            ),
            cat
          );
        } else {
          createCategory(
            template(
              LMessages.tc.categoryName,
              { username: message.author.username },
              { before: "%", after: "%" }
            )
          ).then((category) => {
            createChannel(
              template(
                LMessages.tc.voiceName,
                { username: message.author.username },
                { before: "%", after: "%" }
              ),
              category
            );
          });
        }
      } else {
        createCategory(
          template(
            LMessages.tc.categoryName,
            { username: message.author.username },
            { before: "%", after: "%" }
          )
        ).then((category) => {
          createChannel(
            template(
              LMessages.tc.voiceName,
              { username: message.author.username },
              { before: "%", after: "%" }
            ),
            category
          );
        });
      }
    } else if (args[0] == "add") {
      if (!message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) {
        message.channel.send(LMessages.botNoPermission);

        return;
      }

      let tc = Gres.tc.filter((x) => x.userID == message.author.id)[0];

      if (tc != null && tc != [] && tc != undefined) {
        if (message.mentions.members.size >= 1) {
          await Guild.updateOne(
            { guildID: message.guild.id },
            { $pull: { tc: tc } }
          );

          message.mentions.members.forEach((value, key) => {
            tc.invitedUserIDs.push(value.id);
          });

          let chan = message.guild.channels.cache.get(tc.channelID);

          if (chan) {
            let overwrites = [];

            if (tc.invitedUserIDs.length > 0 && tc.invitedUserIDs != []) {
              tc.invitedUserIDs.forEach((e) => {
                let constr = {
                  id: e,
                  allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.ManageRoles, Discord.PermissionFlagsBits.Speak, Discord.PermissionFlagsBits.Stream],
                };

                overwrites.push(constr);
              });
            }
            chan.permissionOverwrites.forEach((value, key) => {
              overwrites.push(value);
            });

            chan.overwritePermissions(overwrites);

            await Guild.updateOne(
              { guildID: message.guild.id },
              { $push: { tc: tc } }
            );

            message.channel.send(LMessages.tc.added);
          }
        }
      } else {
        message.channel.send(LMessages.tc.noChannelForUser);
      }
    } else if (args[0] == "remove") {
      if (!message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) {
        message.channel.send(LMessagesq.botNoPermission);

        return;
      }

      let tc = Gres.tc.filter((x) => x.userID == message.author.id)[0];

      if (tc != null && tc != [] && tc != undefined) {
        if (message.mentions.members.size >= 1) {
          await Guild.updateOne(
            { guildID: message.guild.id },
            { $pull: { tc: tc } }
          );

          let removed = [];

          message.mentions.members.forEach((value, key) => {
            if (tc.invitedUserIDs.includes(value.id)) {
              tc.invitedUserIDs.splice(tc.invitedUserIDs.indexOf(value.id), 1);
            }
            removed.push(value.id);
          });

          let chan = message.guild.channels.cache.get(tc.channelID);

          if (chan) {
            let overwrites = [];

            chan.permissionOverwrites.forEach((value, key) => {
              if (!removed.includes(value.id)) {
                overwrites.push(value);
              }
            });

            chan.overwritePermissions(overwrites);

            await Guild.updateOne(
              { guildID: message.guild.id },
              { $push: { tc: tc } }
            );

            message.channel.send(LMessages.tc.removed);
          }
        }
      } else {
        message.channel.send(LMessages.tc.noChannelForUser);
      }
    }
  },
};
