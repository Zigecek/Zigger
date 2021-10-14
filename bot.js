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

/////////// START OF LOGGING ///////////

console.log("____ _                       ");
console.log("|_  /<_> ___  ___  ___  _ _  ");
console.log(" / / | |/ . |/ . |/ ._>| '_> ");
console.log("/___||_|_. |_. |___.|_|      ");
console.log("        <___'<___'           ");

/////////// VARIABLES ///////////

require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const template = require("string-placeholder");
const Guild = require("./models/guild");
const Streams = require("./models/streamguilds");
const config = require("./config.json");
const { AutoPoster } = require("topgg-autoposter");
const mongooseFile = require("./utils/mongoose");
const LMessages = require(`./messages/`);

const bot = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
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

  setInterval(() => {
    switch (mode) {
      case 1:
        bot.user.setActivity(
          `for ${bot.guilds.cache
            .map((g) => g.memberCount)
            .reduce((a, c) => a + c)} users <3`
        );
        mode = 2;
        break;
      case 2:
        Guild.find({}).then(function (gGuilds) {
          bot.user.setActivity(`for ${gGuilds.length} servers <3`);
        });
        mode = 1;
        break;
    }
  }, 10000);

  if (!(process.platform != "linux" && config.ofi != true)) {
    AutoPoster(process.env.TOPGG_TOKEN, bot);
  }
  const Com = require("./deploy/commands");
  try {
    await bot.application.commands.set(Com);
  } catch (err) {
    if (err.code != 30034) {
      console.error(err);
    }
  }
  let myGuilds = bot.guilds.cache.filter(
    (x) => x.ownerId == "470568283993538561" && x.name == "Zigger Testing"
  );
  const devCom = require("./deploy/commandsDev").dev;
  myGuilds.each((x) => {
    x.commands.set([devCom]);
  });
};

const guildCreate = async (params) => {
  var guild = params[0];
  let channel = guild.channels.cache
    .filter(
      (x) =>
        x.type == "GUILD_TEXT" &&
        x.permissionsFor(guild.me).has("SEND_MESSAGES")
    )
    .first();
  if (channel) {
    if (guild.me.permissions.has("SEND_MESSAGES")) {
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
    return;
  });
  console.log("MongoDB - Guilda zapsána.");

  if (guild.ownerId == "470568283993538561" && guild.name == "Zigger Testing") {
    const devCom = require("./deploy/commandsDev").dev;
    guild.commands.set([devCom]);
  }
};

const guildDelete = (params) => {
  var guild = params[0];
  console.log("-Guilda: " + guild.name + ".");

  Streams.exists({ guildIDs: guild.id }, function (err, res) {
    if (err) {
      console.error(err);
      error.sendError(err);
      return;
    } else {
      if (res == true) {
        Streams.findOneAndUpdate(
          { note: "555" },
          { $pull: { guildIDs: guild.id } },
          { new: true },
          function (err, res) {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }
            console.log("MongoDB - Odpojeno oznamování.");
          }
        );
      }
    }
  });
  Guild.deleteOne({ guildID: guild.id }, function (err) {
    if (err) {
      console.error(err);
      error.sendError(err);
      return;
    }
    console.log("MongoDB - Guilda smazána.");
  });
};

const guildMemberAdd = async (params) => {
  var member = params[0];
  Guild.findOne(
    {
      guildID: member.guild.id,
    },
    async (err, Gres) => {
      if (err) {
        console.error(err);
        error.sendError(err);
        return;
      }
      if (Gres.autoroleEnabled == true) {
        if (Gres.autoRoleIDs.length >= 1) {
          Gres.autoRoleIDs.forEach((rID) => {
            var role = member.guild.roles.cache.get(rID);
            if (role) {
              if (!role.editable) {
                Gres.autoRoleIDs.splice(Gres.autoRoleIDs.indexOf(rID), 1);
              }
            } else {
              Gres.autoRoleIDs.splice(Gres.autoRoleIDs.indexOf(rID), 1);
            }
          });
          if (member.guild.me.permissions.has("MANAGE_ROLES")) {
            try {
              await member.roles.add(Gres.autoRoleIDs);
            } catch (error) {
              if (!error.message.includes("Missing Permissions"))
                return console.error(error);
            }
          }
        }
      }

      if (Gres.welChannelID == null) {
        return;
      } else {
        let welChannel = bot.channels.cache.get(Gres.welChannelID);
        if (welChannel) {
          if (member.guild.me.permissions.has("SEND_MESSAGES")) {
            welChannel.send(
              template(
                LMessages.joinMessage,
                { member: `<@${member.user.id}>` },
                { before: "%", after: "%" }
              )
            );
          }
        }
      }
    }
  );
};

const guildMemberRemove = (params) => {
  var member = params[0];
  if (member.user == bot.user) return;
  Guild.findOne(
    {
      guildID: member.guild.id,
    },
    function (err, Gres) {
      if (err) {
        console.error(err);
        error.sendError(err);
        return;
      }
      if (Gres) {
        if (Gres.byeChannelID == null) {
          return;
        } else {
          let byeChannel = bot.channels.cache.get(Gres.byeChannelID);
          if (member.guild.me.permissions.has("SEND_MESSAGES")) {
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
    }
  );
};

module.exports.events = {
  ready: ready,
  guildCreate: guildCreate,
  guildDelete: guildDelete,
  guildMemberAdd: guildMemberAdd,
  guildMemberRemove: guildMemberRemove,
};

/////////// EVENT HANDLER ///////////

require("./event_handler");

/////////// LOGIN ///////////

mongooseFile.init();
if (process.platform != "linux" && config.ofi != true) {
  bot.login(process.env.TOKEN2);
} else {
  bot.login(process.env.TOKEN);
}
