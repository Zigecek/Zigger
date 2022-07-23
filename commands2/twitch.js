const Discord = require("discord.js");
const Guild = require("../models/guild.js");
const Streams = require("../models/streamguilds.js");
const config = require("../config.js");
const template = require("string-placeholder");
const request = require("request");
const error = require("../utils/error");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "twitch",
  cooldown: 3,
  aliases: [],
  category: "twitch",
  async execute(int, serverQueue, Gres) {
    if (int.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
      if (int.options.getSubcommandGroup() == "user") {
        if (int.options.getSubcommand() == "info") {
          var Gres = await Guild.findOne({
            guildID: int.guild.id,
          });
          if (Gres.streamUserName == null || Gres.streamUserID == null) {
            if (
              int.guild.members.me.permissions.has(
                Discord.PermissionFlagsBits.SendMessages
              )
            ) {
              followReply(int, { content: LMessages.twitch.userNotSet });
            }
          } else {
            let Tres = await getUsersByName(
              process.env.TWITCH_ID,
              Gres.streamUserName
            );
            if (Tres) {
              if (Tres.users[0] != null && Tres.users[0] != undefined) {
                if (
                  int.guild.members.me.permissions.has(
                    Discord.PermissionFlagsBits.SendMessages
                  )
                ) {
                  if (
                    int.guild.members.me.permissions.has(
                      Discord.PermissionFlagsBits.EmbedLinks
                    )
                  ) {
                    const Embed2 = new Discord.EmbedBuilder()
                      .setColor(config.colors.purple)
                      .setTitle(Gres.streamUserName)
                      .setURL("https://www.twitch.tv/" + Gres.streamUserName)
                      .setAuthor({
                        name: config.name,
                        iconURL: config.avatarUrl,
                        url: config.webUrl,
                      })
                      .setDescription(Tres.users[0].bio)
                      .setThumbnail(Tres.users[0].logo);

                    followReply(int, { embeds: [Embed2] });
                  } else {
                    followReply(int, {
                      content:
                        "**" +
                        Gres.streamUserName +
                        "**\n" +
                        "`" +
                        Tres.users[0].bio +
                        "`",
                    });
                  }
                }
              } else {
                let Tres2 = await getUserByID(
                  process.env.TWITCH_ID,
                  Gres.streamUserID
                );

                if (Tres2) {
                  if (
                    int.guild.members.me.permissions.has(
                      Discord.PermissionFlagsBits.SendMessages
                    )
                  ) {
                    if (
                      int.guild.members.me.permissions.has(
                        Discord.PermissionFlagsBits.EmbedLinks
                      )
                    ) {
                      const Embed2 = new Discord.EmbedBuilder()
                        .setColor(config.colors.purple)
                        .setTitle(Tres2.display_name)
                        .setURL("https://www.twitch.tv/" + Tres2.display_name)
                        .setAuthor({
                          name: config.name,
                          iconURL: config.avatarUrl,
                          url: config.webUrl,
                        })
                        .setDescription(Tres2.bio)
                        .setThumbnail(Tres2.logo);

                      followReply(int, { embeds: [Embed2] });
                    } else {
                      followReply(int, {
                        content:
                          "**" +
                          Tres2.display_name +
                          "**\n" +
                          "`" +
                          Tres2.bio +
                          "`",
                      });
                    }
                  }
                } else {
                  followReply(int, {
                    content: LMessages.twitch.userProbablyDeletedAcc,
                  });
                }
              }
            }
          }
        } else if (int.options.getSubcommand() == "set") {
          if (int.options.get("user").value != null) {
            let Tres = await getUsersByName(
              process.env.TWITCH_ID,
              int.options.get("user").value
            );
            if (Tres.users[0] == undefined || Tres.users[0] == null) {
              if (
                int.guild.members.me.permissions.has(
                  Discord.PermissionFlagsBits.SendMessages
                )
              ) {
                followReply(int, { content: LMessages.twitch.userNotFound });
              }

              return;
            }
            if (
              int.guild.members.me.permissions.has(
                Discord.PermissionFlagsBits.SendMessages
              )
            ) {
              followReply(int, {
                content: template(
                  LMessages.twitch.userSet,
                  { user: int.options.get("user").value },
                  { before: "%", after: "%" }
                ),
              });
            }

            await Guild.updateOne(
              {
                guildID: int.guild.id,
              },
              {
                streamUserName: int.options.get("user").value,
                streamUserID: Tres.users[0]._id,
              }
            );
          } else {
            if (
              int.guild.members.me.permissions.has(
                Discord.PermissionFlagsBits.SendMessages
              )
            ) {
              followReply(int, { content: LMessages.twitch.userUse });
            }
          }
        }
      } else if (int.options.getSubcommandGroup() == "notifychannel") {
        if (int.options.getSubcommand() == "info") {
          var Gres = await Guild.findOne({
            guildID: int.guild.id,
          });

          if (Gres.streamNotifyChannelID == null) {
            if (
              int.guild.members.me.permissions.has(
                Discord.PermissionFlagsBits.SendMessages
              )
            ) {
              followReply(int, { content: LMessages.twitch.channelNotSet });
            }
          } else {
            if (
              int.guild.members.me.permissions.has(
                Discord.PermissionFlagsBits.SendMessages
              )
            ) {
              followReply(int, {
                content: template(
                  LMessages.twitch.channelInfo,
                  { channel: "<#" + Gres.streamNotifyChannelID + ">" },
                  { before: "%", after: "%" }
                ),
              });
            }
          }
        } else if (int.options.getSubcommand() == "set") {
          if (int.options.get("channel").member != null) {
            await Guild.updateOne(
              {
                guildID: int.guild.id,
              },
              {
                streamNotifyChannelID: int.options.get("channel").member.id,
              }
            );
            if (
              int.guild.members.me.permissions.has(
                Discord.PermissionFlagsBits.SendMessages
              )
            ) {
              followReply(int, {
                content: template(
                  LMessages.twitch.channelSet,
                  {
                    channel: "<#" + int.options.get("channel").member.id + ">",
                  },
                  { before: "%", after: "%" }
                ),
              });
            }
          } else {
            if (
              int.guild.members.me.permissions.has(
                Discord.PermissionFlagsBits.SendMessages
              )
            ) {
              followReply(int, {
                content: LMessages.channels.notFoundOrNoMention,
              });
            }
            return;
          }
        }
      } else if (int.options.getSubcommandGroup() == "notify") {
        if (int.options.getSubcommand() == "enable") {
          var res = await Streams.exists({ guildIDs: int.guild.id });

          if (!res) {
            await Streams.updateOne(
              { note: "555" },
              { $push: { guildIDs: int.guild.id } }
            );
            if (
              int.guild.members.me.permissions.has(
                Discord.PermissionFlagsBits.SendMessages
              )
            ) {
              followReply(int, { content: LMessages.twitch.turnOn });
            }
          } else {
            if (
              int.guild.members.me.permissions.has(
                Discord.PermissionFlagsBits.SendMessages
              )
            ) {
              followReply(int, { content: LMessages.twitch.isAlreadyOn });
            }
          }
        } else if (int.options.getSubcommand() == "disable") {
          var res = await Streams.exists({ guildIDs: int.guild.id });

          if (res) {
            await Streams.updateOne(
              { note: "555" },
              { $pull: { guildIDs: int.guild.id } },
              { new: true }
            );
            if (
              int.guild.members.me.permissions.has(
                Discord.PermissionFlagsBits.SendMessages
              )
            ) {
              followReply(int, { content: LMessages.twitch.turnOff });
            }
          } else {
            if (
              int.guild.members.me.permissions.has(
                Discord.PermissionFlagsBits.SendMessages
              )
            ) {
              followReply(int, { content: LMessages.twitch.isAlreadyOff });
            }
          }
        }
      }
    } else {
      followReply(int, { content: LMessages.noPermission });
    }
  },
};

const getUsersByName = (clientID, users) => {
  return new Promise((resolve, reject) => {
    if (Array.isArray(users)) {
      if (users.length > 1) {
        users = users.join(",");
      }
    }

    request.get(
      `https://api.twitch.tv/kraken/users?login=${users}`,
      {
        json: true,
        headers: {
          Accept: "application/vnd.twitchtv.v5+json",
          "Client-ID": `${clientID}`,
        },
      },
      (err, res, body) => {
        if (err) {
          reject(err);
        }
        resolve(body);
      }
    );
  });
};

const getUserByID = (clientID, id) => {
  return new Promise((resolve, reject) => {
    request.get(
      `https://api.twitch.tv/kraken/users/${id}`,
      {
        json: true,
        headers: {
          Accept: "application/vnd.twitchtv.v5+json",
          "Client-ID": `${clientID}`,
        },
      },
      (err, res, body) => {
        if (err) {
          reject(err);
        }
        resolve(body);
      }
    );
  });
};
