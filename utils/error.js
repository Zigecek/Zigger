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
const Config = require("../models/Config");
const sourcebin = require("sourcebin");
const { bot } = require("../bot");
var functions = require("./functions");

/**
 * Sends error when err to Discord.
 * @param {string|object} error The error, you want send me.
 * @returns {null} Null
 */
async function sendError(error) {
  Config.findOne(
    {
      number: 1,
    },
    (err, Gres) => {
      if (err) {
        console.error(err);
        return;
      }
      const user = bot.users.cache.find(
        (user) => user.id == Gres.botAdminDiscordID[0]
      );

      sourcebin
        .create([
          {
            name: "Error",
            content: error.stack,
            languageId: "js",
          },
        ])
        .then((res) => {
          user.send("**CHYBA!** \nČas: " + functions.curDT() + " \nChyba: ");
          user.send(res.url + " ");
        })
        .catch(console.error);
    }
  );
}

module.exports = {
  sendError,
};

mongoose.connection.on("err", (error) => {
  console.error(err);

  Config.findOne(
    {
      number: 1,
    },
    (err, Gres) => {
      if (err) {
        console.error(err);
        return;
      }

      const user = bot.users.cache.find(
        (user) => user.id == Gres.botAdminDiscordID[0]
      );

      sourcebin
        .create([
          {
            name: "Error",
            content: error.stack,
            languageId: "js",
          },
        ])
        .then((res) => {
          user.send("**CHYBA!** \nČas: " + functions.curDT() + " \nChyba: ");
          user.send(res.url + " ");
        })
        .catch(console.error);
    }
  );
});
