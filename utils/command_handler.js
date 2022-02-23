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

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`../commands/${file}`);

  bot.commands.set(command.name, command);
}

const commandFiles2 = fs
  .readdirSync("./music/commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles2) {
  const command2 = require(`../music/commands/${file}`);

  bot.commands.set(command2.name, command2);
}

const commandFiles3 = fs
  .readdirSync("./commands2")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles3) {
  const command3 = require(`../commands2/${file}`);

  bot.commands2.set(command3.name, command3);
}

const commandFiles4 = fs
  .readdirSync("./music/commands2")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles4) {
  const command4 = require(`../music/commands2/${file}`);

  bot.commands2.set(command4.name, command4);
}

const commandFiles5 = fs
  .readdirSync("./commandsDev")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles5) {
  const command5 = require(`../commandsDev/${file}`);

  bot.commands2.set(command5.name, command5);
}

/////////// ///////////

const messageCreate = async (params) => {
  var message = params[0];
  if (message.channel.type != "DM" && message.author != bot.user) {
    if (message.author != bot.user && message.author.bot == false) {
      var gExist = false;
      var res = await Guild.exists({ guildID: message.guild.id });

      if (res == false) {
        const guildJoin = new Guild({
          _id: mongoose.Types.ObjectId(),
          guildID: message.guild.id,
          guildName: message.guild.name,
          prefix: config.DefaultPrefix,
        });
        guildJoin.save().catch((err) => {
          console.error(err);
          error.sendError(err);
          return;
        });
        console.log(" ");
        console.log("MongoDB - Guilda zapsána.");
        bot.emit("message", message);
        return;
      } else {
        gExist = true;
      }

      if (gExist == false) {
        return;
      }

      var Gres = await Guild.findOne({
        guildID: message.guild.id,
      });

      var prefix = Gres.prefix;

      //if (message.attachments.size > 0 || message.channel.nsfw != true) require('./noreq/anti-nsfw').execute(message, LMessages);

      var roleID = message.guild.me.roles.cache
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
        var mention = false;
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
            if (message.guild.me.permissions.has("SEND_MESSAGES")) {
              message.channel.send(
                template(
                  LMessages.mention,
                  { prefix: prefix },
                  { before: "%", after: "%" }
                )
              );
            }
            return;
          } else {
            return;
          }
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
            var isFS = false;
            if (map.values().next().value.name == "skip") {
              if (map.values().next().value.aliases.includes(command)) {
                isFS = true;
              }
            }

            ////
            console.log(command + ` (${message.guild.id})`);
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
            if (int.guild.me.permissions.has("SEND_MESSAGES")) {
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

const interactionCreate = async (params) => {
  var int = params[0];
  if (!int.isCommand()) return;
  if (!int.inGuild()) return;
  if (int.channel.type == "DM") return;
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
    await guildJoin.save().catch((err) => {
      console.error(err);
      error.sendError(err);
      return;
    });
    console.log(" ");
    console.log("MongoDB - Guilda zapsána.");
    bot.emit("interactionCreate", int);
    return;
  }

  var Gres = await Guild.findOne({
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
      if (int.guild.me.permissions.has("SEND_MESSAGES")) {
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
    console.log("/ " + int.commandName + ` (${int.guild.id})`);
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
