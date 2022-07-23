const Discord = require("discord.js");
const { bot } = require("../bot");
const error = require("./error");
const Guild = require("../models/guild");
const functions = require("./functions");
const LMessages = require(`../messages/`);

const ready = () => {
  callLoop();
  console.log(" ");
  console.log("Počítadla - Počítám.");
};

function callLoop() {
  setInterval(async () => {
    var gGuilds = await Guild.find({});
    gGuilds.forEach(async (Gres) => {
      let guild = await bot.guilds.fetch(Gres.guildID);
      if (!guild) {
        return;
      }

      if (Gres.counters != null) {
        let counters = Gres.counters;
        if (counters.length != 0) {
          if (
            !guild.members.me.permissions.has(
              Discord.PermissionFlagsBits.ManageChannels
            )
          ) {
            functions.shout(
              `${LMessages.count.noPermission} \n${LMessages.rejoinRecommended}`,
              guild
            );
            return;
          }
          let category = await bot.channels.fetch(
            Gres.countersCategoryChannelID
          );
          if (!category) {
            if (
              guild.members.me.permissions.has(
                Discord.PermissionFlagsBits.ManageChannels
              )
            ) {
              guild.channels
                .create(LMessages.countCategoryName, {
                  type: "GUILD_CATEGORY",
                })
                .then(async (cat) => {
                  category = cat;
                  await Guild.updateOne(
                    {
                      guildID: guild.id,
                    },
                    {
                      countersCategoryChannelID: category.id,
                    }
                  );
                });
            }
          }
          if (
            guild.members.me.permissions.has(
              Discord.PermissionFlagsBits.ManageChannels
            )
          ) {
            category.setPosition(0);
          }

          var m = await guild.members.fetch({ withPresences: true });
          var r = guild.roles.cache;
          var c = await guild.channels.fetch();
          var em = await guild.emojis.fetch();

          counters.forEach(async (e) => {
            if (!c.has(e.channelID)) {
              await Guild.updateOne(
                { guildID: Gres.guildID },
                { $pull: { counters: e } }
              );
              return;
            }

            const channel = c.get(e.channelID);
            var count = 0;

            switch (e.type) {
              case "all":
                count = guild.members.memberCount;
                break;
              case "bots":
                count = m.filter((x) => x.user.bot).size;
                break;
              case "members":
                count = m.filter((x) => !x.user.bot).size;
                break;
              case "offline":
                count = m.filter(
                  (x) =>
                    !x.user.bot &&
                    (x.presence?.status ?? "offline") == "offline"
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
                count = c.size;
                break;
              case "text":
                count = c.filter(
                  (x) => x.type == Discord.ChannelType.GuildText
                ).size;
                break;
              case "voice":
                count = c.filter(
                  (x) => x.type == Discord.ChannelType.GuildVoice
                ).size;
                break;
              case "categories":
                count = c.filter(
                  (x) => x.type == Discord.ChannelType.GuildCategory
                ).size;
                break;
              case "announcement":
                count = c.filter(
                  (x) => x.type == Discord.ChannelType.GuildNews
                ).size;
                break;
              case "stages":
                count = c.filter(
                  (x) => x.type == Discord.ChannelType.GuildStageVoice
                ).size;
                break;
              case "emojis":
                count = em.size;
                break;
              case "boosters":
                count = m.filter((m) => m.permiumSince).size;
                break;
              case "tier":
                count = guild.premiumTier;
                break;
            }

            if (channel) {
              if (channel.parent.id != category.id) {
                if (
                  guild.members.me.permissions.has(
                    Discord.PermissionFlagsBits.ManageChannels
                  )
                ) {
                  channel.setParent(category);
                }
              }
              let numbers = channel.name.match(/\d+/);
              if (numbers.length > 0) {
                var name = channel.name;
                name = name.replace(/\d+/, count.toString());
                if (name != channel.name) {
                  if (
                    guild.members.me.permissions.has(
                      Discord.PermissionFlagsBits.ManageChannels
                    )
                  ) {
                    channel.setName(name);
                  }
                }
              } else {
                if (
                  guild.members.me.permissions.has(
                    Discord.PermissionFlagsBits.ManageChannels
                  )
                ) {
                  channel.setName(channel.name + " " + count);
                }
              }
            } else {
              await Guild.updateOne(
                { guildID: Gres.guildID },
                { $pull: { counters: e } }
              );
            }
          });
        }
      }
    });
  }, 10 * 60 * 1000);
}

const channelDelete = async (channel) => {
  var Gres = await Guild.findOne({
    guildID: channel.guild.id,
  });

  if (!Gres.countersSetupDone) return;
  if (Gres.countersCategoryChannelID != channel.id) return;

  if (Gres.counters.length > 0) {
    Gres.counters.forEach(async (e) => {
      let channel = await message.guild.channels.fetch(e.channelID);
      if (channel) {
        if (channel.deletable == true) {
          channel.delete();
        }
      }
    });
  }
  let category = await message.guild.channels.fetch(
    Gres.countersCategoryChannelID
  );
  if (category) {
    if (category.deletable) {
      category.delete();
    }
  }
  await Guild.updateOne(
    {
      guildID: message.guild.id,
    },
    {
      counters: [],
      countersCategoryChannelID: null,
      countersSetupDone: false,
    }
  );
};

module.exports = {
  events: {
    channelDelete: channelDelete,
    ready: ready,
  },
};
