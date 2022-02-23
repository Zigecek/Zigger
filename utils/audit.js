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

const mongoose = require("mongoose");
const botFile = require("../bot");
const bot = botFile.bot;
const config = require("../config.js");
const error = require("./error");
const Guild = require("../models/guild");

const ready = async () => {
  bot.guilds.cache.each(async (guild) => {
    var res = await Guild.exists({ guildID: guild.id });

    if (res == false) {
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
      console.log(" ");
      console.log("MongoDB - Guilda zapsána.");
    }
  });
  var Gres = await Guild.find({});

  if (Gres) {
    Gres.forEach(async (e) => {
      if (!bot.guilds.cache.has(e.guildID)) {
        await Guild.deleteOne({ guildID: e.guildID });
        console.log(" ");
        console.log("MongoDB - Guilda smazána.");
      }
    });
  }
};

module.exports = {
  events: {
    ready: ready,
  },
};
