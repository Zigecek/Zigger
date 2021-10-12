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
const config = require("../config.json");
const error = require("./error");
const Guild = require("../models/guild");

const ready = () => {
  bot.guilds.cache.each((guild) => {
    Guild.exists({ guildID: guild.id }, function (err, res) {
      if (err) {
        console.error(err);
        error.sendError(err);
        return;
      } else {
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
      }
    });
  });
  Guild.find({}, (err, Gres) => {
    if (err) {
      console.error(err);
      error.sendError(err);
      return;
    }

    if (Gres) {
      Gres.forEach((e) => {
        if (!bot.guilds.cache.has(e.guildID)) {
          Guild.deleteOne({ guildID: e.guildID }, function (err) {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }
            console.log(" ");
            console.log("MongoDB - Guilda smazána.");
          });
        }
      });
    }
  });
};

module.exports = {
  events: {
    ready: ready,
  },
};
