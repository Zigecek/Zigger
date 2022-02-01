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
const { followReply } = require("../utils/functions");

module.exports = {
  name: "counters",
  cooldown: 3,
  aliases: [],
  category: "counters",
  async execute(int, serverQueue, Gres) {
    if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) return;
    let counterTypes = [
      "all",
      "members",
      "bots",
      "online",
      "offline",
      "notOffline",
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
      int.member.permissions.has("ADMINISTRATOR") ||
      int.member.permissions.has("MANAGE_CHANNELS")
    ) {
      if (!int.guild.me.permissions.has("MANAGE_CHANNELS")) {
        followReply(int, { content: LMessages.count.botHasNoPermission });

        return;
      }

      const m = await int.guild.members.fetch({ withPresences: true });
      const r = await int.guild.roles.fetch();
      const c = await int.guild.channels.fetch();
      const em = await int.guild.emojis.fetch();
      function createChannelWithParent(category, type) {
        return new Promise((resolve, reject) => {
          var count = 0;

          switch (type) {
            case "all":
              count = int.guild.memberCount;
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
            case "notOffline":
              count = m.filter(
                (x) =>
                  !x.user.bot &&
                  ["online", "idle", "dnd"].includes(x.presence?.status)
              ).size;
              break;
            case "dnd":
              count = m.filter(
                (x) => !x.user.bot && x.presence?.status == "dnd"
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
              count = int.guild.premiumTier;
              break;
          }

          var chanName =
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
              ? LMessages.countRoles
              : type == "channels"
              ? LMessages.countChannels
              : type == "text"
              ? LMessages.countText
              : type == "voice"
              ? LMessages.countVoice
              : type == "categories"
              ? LMessages.countCategories
              : type == "announcement"
              ? LMessages.countAnnouncement
              : type == "stages"
              ? LMessages.countStages
              : type == "emojis"
              ? LMessages.countEmojis
              : type == "boosters"
              ? LMessages.countBoosters
              : type == "tier"
              ? LMessages.countTier
              : ".";
          int.guild.channels
            .create(
              template(chanName, { count: count }, { before: "%", after: "%" }),
              {
                type: "GUILD_VOICE",
                parent: category,
              }
            )
            .then(async (chan) => {
              await Guild.updateOne(
                { guildID: int.guild.id },
                {
                  $push: {
                    counters: {
                      type: type,
                      channelID: chan.id,
                    },
                  },
                }
              );
              resolve(chan);
            })
            .catch((err) => {
              reject(err);
            });
        });
      }

      if (int.options.getSubcommand() == "setup") {
        if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
          return;
        }

        if (!int.guild.me.permissions.has("MANAGE_CHANNELS")) {
          followReply(int, { content: LMessages.botNoPermission });
          return;
        }

        if (Gres.countersSetupDone == false) {
          int.guild.channels
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

              followReply(int, {
                content: template(
                  LMessages.countSetupFinished,
                  { prefix: Gres.prefix },
                  { before: "%", after: "%" }
                ),
              });

              await Guild.updateOne(
                {
                  guildID: int.guild.id,
                },
                {
                  countersSetupDone: true,
                  countersCategoryChannelID: category.id,
                }
              );
            });
        } else {
          followReply(int, {
            content: template(
              LMessages.countSetupAlreadyDone,
              { prefix: Gres.prefix },
              { before: "%", after: "%" }
            ),
          });
        }
      } else if (int.options.getSubcommand() == "create") {
        if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
          return;
        }

        if (!int.guild.me.permissions.has("MANAGE_CHANNELS")) {
          followReply(int, { content: LMessages.botNoPermission });
          return;
        }

        if (!Gres.countersSetupDone) {
          followReply(int, {
            content: template(
              LMessages.countSetupNotDone,
              { prefix: Gres.prefix },
              { before: "%", after: "%" }
            ),
          });

          return;
        } else {
          if (Gres.countersCategoryChannelID != null) {
            let category = int.guild.channels.cache.get(
              Gres.countersCategoryChannelID
            );
            await createChannelWithParent(
              category,
              int.options.get("type").value
            );
            followReply(int, { content: LMessages.countCounterCreated });
            return;
          } else {
            return;
          }
        }
      } else if (int.options.getSubcommand() == "customize") {
        followReply(int, { content: LMessages.countCustomize });
      } else if (int.options.getSubcommand() == "reset") {
        if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
          return;
        }

        if (!int.guild.me.permissions.has("MANAGE_CHANNELS")) {
          followReply(int, { content: LMessages.botNoPermission });
          return;
        }

        if (Gres.counters.length > 0) {
          var channels2del = [];
          Gres.counters.forEach(async (e) => {
            let channel = await int.guild.channels.fetch(e.channelID);
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
          let category = int.guild.channels.cache.get(
            Gres.countersCategoryChannelID
          );
          if (category) {
            if (category.deletable) {
              category.delete();
            }
          }
        }
        await Guild.updateOne(
          {
            guildID: int.guild.id,
          },
          {
            counters: [],
            countersCategoryChannelID: null,
            countersSetupDone: false,
          }
        );

        followReply(int, { content: LMessages.countResetSuccesful });
      }
    } else {
      followReply(int, { content: LMessages.noPermission });

      return;
    }
  },
};
