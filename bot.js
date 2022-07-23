/////////// START OF LOGGING ///////////

console.log("____  _   __    __    ____  ___ ");
console.log(" / / | | / /`_ / /`_ | |_  | |_)");
console.log("/_/_ |_| \\_\\_/ \\_\\_/ |_|__ |_| \\");

/////////// VARIABLES ///////////

const config = require("./config");
require("dotenv").config({ path: config.index == 1 ? ".env" : ".env2" });
const Discord = require("discord.js");
const mongoose = require("mongoose");
const template = require("string-placeholder");
const Guild = require("./models/guild");
const Streams = require("./models/streamguilds");
const { AutoPoster } = require("topgg-autoposter");
const mongooseFile = require("./utils/mongoose");
const LMessages = require(`./messages/`);
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const rest = new REST({ version: "10" }).setToken(
  process.platform != "linux" && !config.ofi
    ? process.env.TOKEN2
    : process.env.TOKEN
);

const bot = new Discord.Client({
  partials: [
    Discord.Partials.Message,
    Discord.Partials.Channel,
    Discord.Partials.Reaction,
  ],
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMessageReactions,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.GuildPresences,
    Discord.GatewayIntentBits.GuildEmojisAndStickers,
    Discord.GatewayIntentBits.MessageContent,
  ],
});

module.exports = {
  bot: bot,
};

/////////// EVENTS ///////////

const ready = async () => {
  console.log(" ");
  console.log("Zigger - Pracuji.");

  var mode = 1;

  setInterval(async () => {
    switch (mode) {
      case 1:
        bot.user.setActivity(
          `for ${bot.users.cache.filter((u) => !u.bot).size} users <3`
        );
        mode = 2;
        break;
      case 2:
        var gGuilds = await Guild.find({});
        bot.user.setActivity(`for ${gGuilds.length} servers <3`);
        mode = 1;
        break;
    }
  }, 10000);

  if (process.platform == "linux" && config.ofi && config.index == 1) {
    AutoPoster(process.env.TOPGG_TOKEN, bot);
  }
  const Com = require("./deploy/commands");
  await rest.put(Routes.applicationCommands(bot.user.id), { body: Com });
  let myGuilds = bot.guilds.cache.filter(
    (x) => x.ownerId == "470568283993538561" && x.name == "Zigger Testing"
  );
  const devCom = require("./deploy/commandsDev");
  myGuilds.each(async (x) => {
    await rest.put(Routes.applicationGuildCommands(bot.user.id, x.id), {
      body: devCom,
    });
  });
};

const guildCreate = (guild) => {
  let channel = guild.channels.cache
    .filter(
      (x) =>
        x.type == Discord.ChannelType.GuildText &&
        x
          .permissionsFor(guild.members.me)
          .has(Discord.PermissionFlagsBits.SendMessages)
    )
    .first();
  if (channel) {
    if (
      guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)
    ) {
      channel.send(
        template(
          LMessages.botJoinsGuild,
          { prefix: config.DefaultPrefix },
          { before: "%", after: "%" }
        )
      );
    }
  }

  console.log("+ Guilda: " + guild.name + "(" + guild.id + ")");
  const guildJoin = new Guild({
    _id: mongoose.Types.ObjectId(),
    guildID: guild.id,
    guildName: guild.name,
    prefix: config.DefaultPrefix,
  });
  guildJoin.save().catch((err) => {
    console.error(err);
    error.sendError(err);
  });
  console.log("MongoDB - Guilda zapsána.");

  if (guild.ownerId == "470568283993538561" && guild.name == "Zigger Testing") {
    const devCom = require("./deploy/commandsDev").dev;
    guild.commands.set([devCom]);
  }
};

const guildDelete = async (guild) => {
  console.log("-Guilda: " + guild.name + ".");

  var res = await Streams.exists({ guildIDs: guild.id });

  if (res) {
    await Streams.updateOne(
      { note: "555" },
      { $pull: { guildIDs: guild.id } },
      { new: true }
    );
    console.log("MongoDB - Odpojeno oznamování.");
  }

  await Guild.deleteOne({ guildID: guild.id });
  console.log("MongoDB - Guilda smazána.");
};

const guildMemberAdd = async (member) => {
  var Gres = await Guild.findOne({
    guildID: member.guild.id,
  });
  if (Gres.autoroleEnabled && Gres.autoRoleIDs.length >= 1) {
    Gres.autoRoleIDs.forEach((rID) => {
      var role = member.guild.roles.cache.get(rID);
      if (!role?.editable) {
        Gres.autoRoleIDs.splice(Gres.autoRoleIDs.indexOf(rID), 1);
      }
    });
    if (
      member.guild.members.me.permissions.has(
        Discord.PermissionFlagsBits.ManageRoles
      )
    ) {
      try {
        await member.roles.add(Gres.autoRoleIDs);
      } catch (error) {
        if (!error.message.includes("Missing Permissions"))
          return console.error(error);
      }
    }
  }

  if (Gres.welChannelID != null) {
    let welChannel = bot.channels.cache.get(Gres.welChannelID);
    if (
      welChannel &&
      member.guild.members.me.permissions.has(
        Discord.PermissionFlagsBits.SendMessages
      )
    ) {
      welChannel.send(
        template(
          LMessages.joinMessage,
          { member: `<@${member.user.id}>` },
          { before: "%", after: "%" }
        )
      );
    }
  }
};

const guildMemberRemove = async (member) => {
  if (member.user == bot.user) return;
  var Gres = await Guild.findOne({
    guildID: member.guild.id,
  });

  if (Gres) {
    if (Gres.byeChannelID == null) {
      return;
    } else {
      let byeChannel = bot.channels.cache.get(Gres.byeChannelID);
      if (
        member.guild.members.me.permissions.has(
          Discord.PermissionFlagsBits.SendMessages
        )
      ) {
        if (byeChannel) {
          byeChannel.send(
            template(
              LMessages.leaveMessage,
              { member: member.user.username },
              { before: "%", after: "%" }
            )
          );
        }
      }
    }
  }
};

module.exports.events = {
  ready: ready,
  guildCreate: guildCreate,
  guildDelete: guildDelete,
  guildMemberAdd: guildMemberAdd,
  guildMemberRemove: guildMemberRemove,
};

/////////// EVENT HANDLER ///////////

require("./utils/event_handler");

/////////// LOGIN ///////////

mongooseFile.init();
bot.login(
  process.platform != "linux" && !config.ofi
    ? process.env.TOKEN2
    : process.env.TOKEN
);
