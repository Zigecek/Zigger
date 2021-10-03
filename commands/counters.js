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
const { bot } = require("../bot");
const error = require("../utils/error");
const template = require("string-placeholder");
const LMessages = require(`../messages/`);

module.exports = {
  name: "counters",
  cooldown: 3,
  aliases: [],
  category: "counters",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
      return;
    let counterTypes = [
      "all",
      "members",
      "bots",
      "online",
      "offline",
      "idle",
      "dnd",
      "notOffline",
      "roles",
      "channels",
      "text",
      "voice",
      "categories",
      "announcement",
      "stages",
      "emojis",
      "boosters",
      "tier",
    ];

    if (
      message.member.permissions.has("ADMINISTRATOR") ||
      message.member.permissions.has("MANAGE_CHANNELS")
    ) {
      if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) {
        message.channel.send(LMessages.count.botHasNoPermission);

        return;
      }

      const m = await message.guild.members.fetch();
      const r = await message.guild.roles.fetch();
      const c = await message.guild.channels.fetch();
      const em = await message.guild.emojis.fetch();
      function createChannelWithParent(category, type) {
        return new Promise((resolve, reject) => {
          var count = 0;

          switch (type) {
            case "all":
              count = message.guild.memberCount;
              break;
            case "bots":
              count = m.filter((m) => m.user.bot).size;
              break;
            case "members":
              count = m.filter((m) => !m.user.bot).size;
              break;
            case "offline":
              count = m.filter(
                (x) =>
                  !x.user.bot && (x.presence?.status ?? "offline") == "offline"
              ).size;
              break;
            case "online":
              count = m.filter(
                (x) => !x.user.bot && x.presence?.status == "online"
              ).size;
              break;
            case "idle":
              count = m.filter(
                (x) => !x.user.bot && x.presence?.status == "idle"
              ).size;
              break;
            case "dnd":
              count = m.filter(
                (x) => !x.user.bot && x.presence?.status == "dnd"
              ).size;
              break;
            case "notOffline":
              count = m.filter(
                (x) =>
                  !x.user.bot &&
                  ["online", "idle", "dnd"].includes(x.presence?.status)
              ).size;
              break;
            case "roles":
              count = r.size - 1;
              break;
            case "channels":
              count = c.filter((x) => x.type != "GUILD_CATEGORY").size;
              break;
            case "text":
              count = c.filter((x) => x.type == "GUILD_TEXT").size;
              break;
            case "voice":
              count = c.filter((x) => x.type == "GUILD_VOICE").size;
              break;
            case "categories":
              count = c.filter((x) => x.type == "GUILD_CATEGORY").size;
              break;
            case "announcement":
              count = c.filter((x) => x.type == "GUILD_NEWS").size;
              break;
            case "stages":
              count = c.filter((x) => x.type == "GUILD_STAGE").size;
              break;
            case "emojis":
              count = em.size;
              break;
            case "boosters":
              count = m.filter((m) => m.permiumSince).size;
              break;
            case "tier":
              count = message.guild.premiumTier;
              break;
          }

          message.guild.channels
            .create(
              template(
                type == "all"
                  ? LMessages.countAllName
                  : type == "members"
                  ? LMessages.countOnlyMembersName
                  : type == "bots"
                  ? LMessages.countOnlyBotsName
                  : type == "online"
                  ? LMessages.countOnlineMembers
                  : type == "offline"
                  ? LMessages.countOfflineMembers
                  : type == "idle"
                  ? LMessages.countIdleMembers
                  : type == "dnd"
                  ? LMessages.countDndMembers
                  : type == "notOffline"
                  ? LMessages.countNotOfflineMembers
                  : type == "roles"
                  ? LMessages.countRolesMembers
                  : type == "channels"
                  ? LMessages.countChannelsMembers
                  : type == "text"
                  ? LMessages.countTextMembers
                  : type == "voice"
                  ? LMessages.countVoiceMembers
                  : type == "categories"
                  ? LMessages.countCategoriesMembers
                  : type == "announcement"
                  ? LMessages.countAnnouncementMembers
                  : type == "stages"
                  ? LMessages.countStagesMembers
                  : type == "emojis"
                  ? LMessages.countEmojisMembers
                  : type == "boosters"
                  ? LMessages.countBoostersMembers
                  : type == "tier"
                  ? LMessages.countTierMembers
                  : '.',
                { count: count },
                { before: "%", after: "%" }
              ),
              {
                type: "GUILD_VOICE",
                parent: category,
              }
            )
            .then((chan) => {
              Guild.updateOne(
                { guildID: message.guild.id },
                {
                  $push: {
                    counters: {
                      type: type,
                      channelID: chan.id,
                    },
                  },
                },
                (err, result) => {
                  if (err) {
                    console.error(err);
                    error.sendError(err);
                    return;
                  }
                }
              );
              resolve(chan);
            })
            .catch((err) => {
              reject(err);
            });
        });
      }

      if (args[0] == "setup") {
        if (
          !message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
        ) {
          return;
        }

        if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) {
          message.channel.send(LMessages.botNoPermission);
          return;
        }

        if (Gres.countersSetupDone == false) {
          message.guild.channels
            .create(LMessages.countCategoryName, {
              type: "GUILD_CATEGORY",
            })
            .then(async (category) => {
              category.setPosition(0);

              try {
                await createChannelWithParent(category, "all");
                await createChannelWithParent(category, "members");
                await createChannelWithParent(category, "bots");
              } catch (error) {
                console.error(error);
                return;
              }

              message.channel.send(
                template(
                  LMessages.countSetupFinished,
                  { prefix: prefix },
                  { before: "%", after: "%" }
                )
              );

              Guild.findOneAndUpdate(
                {
                  guildID: message.guild.id,
                },
                {
                  countersSetupDone: true,
                  countersCategoryChannelID: category.id,
                },
                function (err) {
                  if (err) {
                    console.error(err);
                    error.sendError(err);
                    return;
                  }
                }
              );
            });
        } else {
          message.channel.send(
            template(
              LMessages.countSetupAlreadyDone,
              { prefix: prefix },
              { before: "%", after: "%" }
            )
          );
        }
      } else if (args[0] == "create") {
        if (
          !message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
        ) {
          return;
        }

        if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) {
          message.channel.send(LMessages.botNoPermission);
          return;
        }

        if (!Gres.countersSetupDone) {
          message.channel.send(
            template(
              LMessages.countSetupNotDone,
              { prefix: Gres.prefix },
              { before: "%", after: "%" }
            )
          );

          return;
        } else {
          message.channel
            .send(LMessages.countChooseTypeOfCounter)
            .then(async (smessage) => {
              let category = await bot.channels.fetch(
                Gres.countersCategoryChannelID
              );

              const filter = (m) => m.author.id == message.author.id;
              const collector = smessage.channel
                .createMessageCollector(filter, { time: 40000 })
                .on("collect", async (m) => {
                  collector.stop();
                  if (counterTypes.includes(m.content.toLowerCase())) {
                    try {
                      await createChannelWithParent(
                        category,
                        m.content.toLowerCase()
                      );
                    } catch (error) {
                      console.error(error);
                      message.channel.send(LMessages.error);
                    }
                  } else {
                    message.channel.send(LMessages.count.invalidType);
                  }
                })
                .on("end", async (collected) => {
                  if (smessage) {
                    if (smessage.deletable) {
                      if (message.guild.me.permissions.has("MANAGE_MESSAGES")) {
                        smessage.delete();
                      }
                    }
                  }
                });
            });
        }
      } else if (args[0] == "customize") {
        message.channel.send(LMessages.countCustomize);
      } else if (args[0] == "reset") {
        if (
          !message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
        ) {
          return;
        }

        if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) {
          message.channel.send(LMessages.botNoPermission);
          return;
        }

        if (Gres.counters.length > 0) {
          var channels2del = [];
          Gres.counters.forEach(async (e) => {
            let channel = await message.guild.channels.fetch(e.channelID);
            if (channel) {
              if (channel.deletable == true) {
                channels2del.push(channel);
              }
            }
          });
          del(channels2del);
          function del(channels) {
            channels
              .shift()
              .delete()
              .then(() => {
                setTimeout(() => {
                  del(channels);
                }, 1000);
              });
          }
        }
        if (Gres.countersCategoryChannelID != null) {
          let category = message.guild.channels.cache.get(
            Gres.countersCategoryChannelID
          );
          if (category) {
            if (category.deletable) {
              category.delete();
            }
          }
        }
        Guild.findOneAndUpdate(
          {
            guildID: message.guild.id,
          },
          {
            counters: [],
            countersCategoryChannelID: null,
            countersSetupDone: false,
          },
          function (err) {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }
          }
        );

        message.channel.send(LMessages.countResetSuccesful);
      }
    } else {
      message.channel.send(LMessages.noPermission);

      return;
    }
  },
};
