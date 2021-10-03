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
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "tempchannel",
  cooldown: 1,
  aliases: ["tc", "tempchan"],
  category: "tempchannel",
  async execute(int, serverQueue, Gres) {
    if (int.options.getSubcommand() == "create") {
      if (
        !int.guild.me.permissions.has("MANAGE_CHANNELS") ||
        !int.guild.me.permissions.has("MANAGE_ROLES") ||
        !int.guild.me.permissions.has("VIEW_CHANNEL")
      ) {
        followReply(int, { content: LMessages.botNoPermission });
        return;
      }

      let his = Gres.tc.filter((x) => x.userID == int.user.id)[0];

      if (his != null || his != undefined) {
        followReply(int, { content: LMessages.tc.alreadyCreated });

        return;
      }

      let tcConctructor = {
        userID: "",
        channelID: "",
        invitedUserIDs: [],
        joined: false,
      };

      function timer(channel) {
        setTimeout(() => {
          Guild.findOne(
            {
              guildID: channel.guild.id,
            },
            (err, Gres) => {
              if (err) {
                console.error(err);
                error.sendError(err);
                return;
              }

              let tc = Gres.tc.filter((x) => x.channelID == channel.id)[0];

              if (tc != null && tc != [] && tc != undefined) {
                if (tc.joined == false) {
                  channel.delete();

                  Guild.findOneAndUpdate(
                    { guildID: channel.guild.id },
                    { $pull: { tc: tc } },
                    (err, res) => {
                      if (err) {
                        console.error(err);
                        error.sendError(err);
                        return;
                      }
                    }
                  );
                }
              }
            }
          );
        }, 60000);
      }

      function createCategory(name) {
        return new Promise((resolve, reject) => {
          int.guild.channels
            .create(name, {
              type: "GUILD_CATEGORY",
              permissionOverwrites: [
                {
                  id: int.guild.me,
                  allow: ["VIEW_CHANNEL"],
                  type: "member",
                },
                {
                  id: int.guild.roles.everyone,
                  deny: ["VIEW_CHANNEL"],
                  type: "role",
                },
              ],
            })
            .then((category) => {
              Guild.findOneAndUpdate(
                {
                  guildID: int.guild.id,
                },
                {
                  tcCategoryID: category.id,
                },
                function (err) {
                  if (err) {
                    console.error(err);
                    error.sendError(err);
                    return;
                  }
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
          int.guild.channels
            .create(name, {
              type: "GUILD_VOICE",
              permissionOverwrites: [
                {
                  id: int.guild.roles.everyone,
                  deny: ["VIEW_CHANNEL"],
                  type: "role",
                },
                {
                  id: int.member,
                  allow: ["VIEW_CHANNEL"],
                  type: "member",
                },
                {
                  id: int.guild.me,
                  allow: ["VIEW_CHANNEL"],
                  type: "member",
                },
              ],
              parent: category,
            })
            .then((channel) => {
              if (int.member.voice.channel) {
                int.member.voice.setChannel(channel);
                tcConctructor.joined = true;
              } else {
                tcConctructor.joined = false;
              }

              tcConctructor.userID = int.user.id;
              tcConctructor.channelID = channel.id;
              tcConctructor.invitedUserIDs = [];

              Guild.findOneAndUpdate(
                { guildID: int.guild.id },
                { $push: { tc: tcConctructor } },
                (err, res) => {
                  if (err) {
                    console.error(err);
                    error.sendError(err);
                    return;
                  }
                }
              );

              followReply(int, { content: LMessages.tc.channelCreated });

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
        let cat = int.guild.channels.cache.get(Gres.tcCategoryID);
        if (cat) {
          createChannel(
            template(
              LMessages.tc.voiceName,
              { username: int.user.username },
              { before: "%", after: "%" }
            ),
            cat
          );
        } else {
          createCategory(
            template(
              LMessages.tc.categoryName,
              { username: int.user.username },
              { before: "%", after: "%" }
            )
          ).then((category) => {
            createChannel(
              template(
                LMessages.tc.voiceName,
                { username: int.user.username },
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
            { username: int.user.username },
            { before: "%", after: "%" }
          )
        ).then((category) => {
          createChannel(
            template(
              LMessages.tc.voiceName,
              { username: int.user.username },
              { before: "%", after: "%" }
            ),
            category
          );
        });
      }
    } else if (int.options.getSubcommand() == "add") {
      if (!int.guild.me.permissions.has("MANAGE_CHANNELS")) {
        followReply(int, { content: LMessages.botNoPermission });
        return;
      }

      let tc = Gres.tc.filter((x) => x.userID == int.user.id)[0];

      if (tc != null && tc != [] && tc != undefined) {
        let memop = [];
        for (var i = 1; i <= 9; i++) {
          var member = int.options.getUser(`member${i}`);
          if (!member) return;
          memop.push(member.id);
        }
        if (memop.length >= 1) {
          Guild.findOneAndUpdate(
            { guildID: int.guild.id },
            { $pull: { tc: tc } },
            (err, res) => {
              if (err) {
                console.error(err);
                error.sendError(err);
                return;
              }
            }
          );

          memop.forEach((value) => {
            tc.invitedUserIDs.push(value);
          });

          let chan = int.guild.channels.cache.get(tc.channelID);

          if (chan) {
            let overwrites = [];

            if (tc.invitedUserIDs.length > 0 && tc.invitedUserIDs != []) {
              tc.invitedUserIDs.forEach((e) => {
                let constr = {
                  id: e,
                  allow: ["VIEW_CHANNEL", "CONNECT", "SPEAK", "STREAM"],
                };

                overwrites.push(constr);
              });
            }
            chan.permissionOverwrites.forEach((value, key) => {
              overwrites.push(value);
            });

            chan.overwritePermissions(overwrites);

            Guild.findOneAndUpdate(
              { guildID: int.guild.id },
              { $push: { tc: tc } },
              (err, res) => {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }
              }
            );

            followReply(int, { content: LMessages.tc.added });
          }
        } else {
          followReply(int, { content: LMessages.tc.mentionAtLeastOne });
          return;
        }
      } else {
        followReply(int, { content: LMessages.tc.noChannelForUser });
        return;
      }
    } else if (int.options.getSubcommand() == "remove") {
      if (!int.guild.me.permissions.has("MANAGE_CHANNELS")) {
        followReply(int, { content: LMessagesq.botNoPermission });
        return;
      }

      let tc = Gres.tc.filter((x) => x.userID == int.user.id)[0];

      if (tc != null && tc != [] && tc != undefined) {
        let memop = [];
        for (var i = 1; i <= 9; i++) {
          var member = int.options.getUser(`member${i}`);
          if (!member) return;
          memop.push(member.id);
        }
        if (memop.length >= 1) {
          Guild.findOneAndUpdate(
            { guildID: int.guild.id },
            { $pull: { tc: tc } },
            (err, res) => {
              if (err) {
                console.error(err);
                error.sendError(err);
                return;
              }
            }
          );

          let removed = [];

          memop.forEach((value) => {
            if (tc.invitedUserIDs.includes(value.member.id)) {
              tc.invitedUserIDs.splice(
                tc.invitedUserIDs.indexOf(value.member.id),
                1
              );
            }
            removed.push(value.member.id);
          });

          let chan = int.guild.channels.cache.get(tc.channelID);

          if (chan) {
            let overwrites = [];

            chan.permissionOverwrites.forEach((value, key) => {
              if (!removed.includes(value.id)) {
                overwrites.push(value);
              }
            });

            chan.overwritePermissions(overwrites);

            Guild.findOneAndUpdate(
              { guildID: int.guild.id },
              { $push: { tc: tc } },
              (err, res) => {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }
              }
            );

            followReply(int, { content: LMessages.tc.removed });
          }
        }
      } else {
        followReply(int, { content: LMessages.tc.noChannelForUser });
      }
    }
  },
};
