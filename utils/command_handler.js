const { bot } = require("../bot");
const error = require("./error");
const mongoose = require("mongoose");
const Guild = require("../models/guild");
const config = require("../config.js");
const music = require("../music/music");
const fs = require("fs");
const template = require("string-placeholder");
const LMessages = require(`../messages/`);
const { followReply } = require("./functions");
const Discord = require("discord.js");
const functions = require("./functions");

bot.commands = new Discord.Collection();
bot.commands2 = new Discord.Collection();
bot.commandsDev = new Discord.Collection();

/////////// IMPORT ///////////
[
  {
    path: "./commands",
    group: 1,
  },
  {
    path: "./music/commands",
    group: 1,
  },
  {
    path: "./commands2",
    group: 2,
  },
  {
    path: "./music/commands2",
    group: 2,
  },
  {
    path: "./commandsDev",
    group: 2,
  },
].forEach((commandFolder) => {
  const commandFiles = fs
    .readdirSync(commandFolder.path)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`.${commandFolder.path}/${file}`);

    if (commandFolder.group == 1) {
      bot.commands.set(command.name, command);
    } else if (commandFolder.group == 2) {
      bot.commands2.set(command.name, command);
    }
  }
});

/////////// ///////////

const messageCreate = async (message) => {
  if (message.channel.type != Discord.ChannelType.DM && message.author != bot.user) {
    if (message.author != bot.user && message.author.bot == false) {
      let res = await Guild.exists({ guildID: message.guild.id });

      if (!res) {
        const guildJoin = new Guild({
          _id: mongoose.Types.ObjectId(),
          guildID: message.guild.id,
          guildName: message.guild.name,
          prefix: config.DefaultPrefix,
        });
        try {
          await guildJoin.save();
          console.log(" ");
          console.log("MongoDB - Guilda zapsána.");
        } catch (err) {
          console.error(err);
          error.sendError(err);
        }

        return bot.emit("message", message);
      }

      let Gres = await Guild.findOne({
        guildID: message.guild.id,
      });

      let prefix = Gres.prefix;

      //if (message.attachments.size > 0 || message.channel.nsfw != true) require('./noreq/anti-nsfw').execute(message, LMessages);

      let roleID = message.guild.members.me.roles.cache
        .filter((x) => x.managed == true)
        .first()?.id;

      if (
        message.content.startsWith(prefix) ||
        message.content.startsWith("<@" + bot.user.id + ">") ||
        message.content.startsWith("<@!" + bot.user.id + ">") ||
        message.content.startsWith("<@&" + roleID + ">")
      ) {
        const serverQueue = music.queue.get(message.guild.id);

        let args = [];
        let mention = false;
        if (message.content.startsWith("<@" + bot.user.id + ">")) {
          args = message.content
            .slice(`<@${bot.user.id}>`.length)
            .trim()
            .split(/ +/g);
          mention = true;
        } else if (message.content.startsWith("<@!" + bot.user.id + ">")) {
          args = message.content
            .slice(`<@!${bot.user.id}>`.length)
            .trim()
            .split(/ +/g);
          mention = true;
        } else if (message.content.startsWith("<@&" + roleID + ">")) {
          args = message.content
            .slice(`<@&${roleID}>`.length)
            .trim()
            .split(/ +/g);
          mention = true;
        } else {
          args = message.content.slice(prefix.length).trim().split(/ +/g);
        }

        if (args == null || args == [] || args[0] == "") {
          if (mention) {
            if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
              message.channel.send(
                template(
                  LMessages.mention,
                  { prefix: prefix },
                  { before: "%", after: "%" }
                )
              );
            }
          }
          return;
        }

        const command = args.shift().toLowerCase();

        let map = new Map(
          [...bot.commands].filter(
            ([k, v]) => v.name == command || v.aliases.includes(command)
          )
        );

        if (map.values().next().value) {
          const elapsed =
            new Date() - Gres.cooldowns[map.values().next().value.name];
          const elapsedTo1 = (elapsed / 1000).toFixed(1);
          const elapsedFloor = Math.floor(elapsed / 1000);

          if (
            elapsedFloor >= map.values().next().value.cooldown ||
            Gres.cooldowns[map.values().next().value.name] == undefined ||
            Gres.cooldowns[map.values().next().value.name] == null
          ) {
            let isFS = false;
            if (map.values().next().value.name == "skip") {
              if (map.values().next().value.aliases.includes(command)) {
                isFS = true;
              }
            }

            ////
            console.log(
              config.index + ": " + command + ` (${message.guild.id})`
            );
            ////
            if (map.values().next().value.category == "music") {
              if (Gres.blacklist.includes(message.channel.id)) {
                message.channel.send(LMessages.music.channelBlacklisted);
                return;
              }
            }

            bot.commands
              .get(map.values().next().value.name)
              .execute(message, serverQueue, args, Gres, prefix, command, isFS);

            await Guild.updateOne(
              {
                guildID: message.guild.id,
              },
              {
                cooldowns: (Gres.cooldowns[map.values().next().value.name] =
                  new Date()),
              }
            );
          } else {
            if (int.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
              int.channel.send(
                template(
                  LMessages.cooldownMess,
                  { secs: elapsedTo1 },
                  { before: "%", after: "%" }
                )
              );
            }
          }
        }
      }
    }
  }
};

const interactionCreate = async (int) => {
  if (int.type != Discord.InteractionType.ApplicationCommand) return;
  if (!int.inGuild()) return;
  if (int.channel.type == Discord.ChannelType.DM) return;
  if (int.member.id == bot.user.id) return;
  if (int.member.user.bot) return;

  var res = await Guild.exists({ guildID: int.guild.id });

  if (!res) {
    const guildJoin = new Guild({
      _id: mongoose.Types.ObjectId(),
      guildID: int.guild.id,
      guildName: int.guild.name,
      prefix: config.DefaultPrefix,
    });
    try {
      await guildJoin.save();
      console.log(" ");
      console.log("MongoDB - Guilda zapsána.");
    } catch (err) {
      console.error(err);
      error.sendError(err);
    }

    return bot.emit("message", message);
  }

  let Gres = await Guild.findOne({
    guildID: int.guild.id,
  });

  const serverQueue = music.queue.get(int.guild.id);

  let map = bot.commands2.filter((v) => v.name == int.commandName);
  if (map.size == 0) {
    let map2 = bot.commandsDev.filter((v) => v.name == int.commandName);
    if (map2.size == 0) return;
    var mapNextValue = map2.values().next().value;
    bot.commandsDev.get(mapNextValue.name).execute(int, serverQueue, Gres);
    return;
  }
  var mapNextValue = map.values().next().value;

  if (mapNextValue) {
    const elapsed = new Date() - Gres.cooldowns[mapNextValue.name];
    const elapsedTo1 = (elapsed / 1000).toFixed(1);
    const elapsedFloor = Math.floor(elapsed / 1000);

    if (!Gres.cooldowns[mapNextValue.name]) {
      await Guild.updateOne(
        {
          guildID: int.guild.id,
        },
        {
          cooldowns: (Gres.cooldowns[mapNextValue.name] = new Date()),
        }
      );
    }

    if (elapsedFloor < mapNextValue.cooldown) {
      if (int.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
        return followReply(int, {
          content: template(
            LMessages.cooldownMess,
            { secs: elapsedTo1 },
            { before: "%", after: "%" }
          ),
        });
      }
    }

    ////
    console.log(config.index + ": / " + int.commandName + ` (${int.guild.id})`);
    ////

    if (mapNextValue.category == "music") {
      if (Gres.blacklist.includes(int.channel.id)) {
        followReply(int, {
          content: LMessages.music.channelBlacklisted,
        });
        return;
      }
    }

    try {
      bot.commands2.get(mapNextValue.name).execute(int, serverQueue, Gres);
    } catch (error) {
      error.sendError(error);
    }

    await Guild.updateOne(
      {
        guildID: int.guild.id,
      },
      {
        cooldowns: (Gres.cooldowns[mapNextValue.name] = new Date()),
      }
    );
  }
};

module.exports = {
  commands: bot.commands,
  events: {
    messageCreate: messageCreate,
    interactionCreate: interactionCreate,
  },
};
