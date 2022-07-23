
const Discord = require("discord.js");
const Guild = require("../models/guild.js");
const Streams = require("../models/streamguilds.js");
const config = require("../config.js");
const template = require("string-placeholder");
const request = require("request");
const error = require("../utils/error");
const LMessages = require(`../messages/`);

module.exports = {
  name: "twitch",
  cooldown: 3,
  aliases: [],
  category: "twitch",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
      if (args[0] == "user") {
        if (args[1] == null) {
          var Gres = await Guild.findOne({
            guildID: message.guild.id,
          });
          if (Gres.streamUserName == null || Gres.streamUserID == null) {
            if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
              message.channel.send(LMessages.twitch.userNotSet);
            }
          } else {
            let Tres = await getUsersByName(
              process.env.TWITCH_ID,
              Gres.streamUserName
            );
            if (Tres) {
              if (Tres.users[0] != null && Tres.users[0] != undefined) {
                if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
                  if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.EmbedLinks)) {
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

                    message.channel.send({ embeds: [Embed2] });
                  } else {
                    message.channel.send(
                      "**" +
                        Gres.streamUserName +
                        "**\n" +
                        "`" +
                        Tres.users[0].bio +
                        "`"
                    );
                  }
                }
              } else {
                let Tres2 = await getUserByID(
                  process.env.TWITCH_ID,
                  Gres.streamUserID
                );

                if (Tres2) {
                  if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
                    if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.EmbedLinks)) {
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

                      message.channel.send({ embeds: [Embed2] });
                    } else {
                      message.channel.send(
                        "**" +
                          Tres2.display_name +
                          "**\n" +
                          "`" +
                          Tres2.bio +
                          "`"
                      );
                    }
                  }
                } else {
                  message.channel.send(LMessages.twitch.userProbablyDeletedAcc);
                }
              }
            }
          }
        } else if (args[1] == "set") {
          if (args[2] != null) {
            let Tres = await getUsersByName(process.env.TWITCH_ID, args[2]);
            if (Tres.users[0] == undefined || Tres.users[0] == null) {
              if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
                message.channel.send(LMessages.twitch.userNotFound);
              }

              return;
            }
            if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
              message.channel.send(
                template(
                  LMessages.twitch.userSet,
                  { user: args[2] },
                  { before: "%", after: "%" }
                )
              );
            }

            await Guild.updateOne(
              {
                guildID: message.guild.id,
              },
              {
                streamUserName: args[2],
                streamUserID: Tres.users[0]._id,
              }
            );
          } else {
            if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
              message.channel.send(LMessages.twitch.userUse);
            }
          }
        }
      } else if (args[0] == "notifychannel" || args[0] == "nc") {
        if (args[1] == null) {
          var Gres = await Guild.findOne({
            guildID: message.guild.id,
          });

          if (Gres.streamNotifyChannelID == null) {
            if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
              message.channel.send(LMessages.twitch.channelNotSet);
            }
          } else {
            if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
              message.channel.send(
                template(
                  LMessages.twitch.channelInfo,
                  { channel: "<#" + Gres.streamNotifyChannelID + ">" },
                  { before: "%", after: "%" }
                )
              );
            }
          }
        } else if (args[1] == "set") {
          if (args[2] != null) {
            if (!message.mentions.channels.first()) {
              if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
                message.channel.send(LMessages.channels.notFoundOrNoMention);
              }
              return;
            }
            await Guild.updateOne(
              {
                guildID: message.guild.id,
              },
              {
                streamNotifyChannelID: message.mentions.channels.first().id,
              }
            );
            if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
              message.channel.send(
                template(
                  LMessages.twitch.channelSet,
                  {
                    channel: "<#" + message.mentions.channels.first().id + ">",
                  },
                  { before: "%", after: "%" }
                )
              );
            }
          } else {
            if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
              message.channel.send(LMessages.twitch.channelUse);
            }
            return;
          }
        }
      } else if (args[0] == "on") {
        var res = await Streams.exists({ guildIDs: message.guild.id });

        if (!res) {
          await Streams.updateOne(
            { note: "555" },
            { $push: { guildIDs: message.guild.id } }
          );
          if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
            message.channel.send(LMessages.twitch.turnOn);
          }
        } else {
          if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
            message.channel.send(LMessages.twitch.isAlreadyOn);
          }
        }
      } else if (args[0] == "off") {
        var res = await Streams.exists({ guildIDs: message.guild.id });

        if (res) {
          await Streams.updateOne(
            { note: "555" },
            { $pull: { guildIDs: message.guild.id } },
            { new: true }
          );
          if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
            message.channel.send(LMessages.twitch.turnOff);
          }
        } else {
          if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
            message.channel.send(LMessages.twitch.isAlreadyOff);
          }
        }
      }
    } else {
      message.channel.send(LMessages.noPermission);
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
