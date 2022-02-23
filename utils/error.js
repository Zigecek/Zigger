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
  var Gres = await Config.findOne({
    number: 1,
  });
  const user = bot.users.cache.find(
    (user) => user.id == Gres.botAdminDiscordID[0]
  );

  sourcebin
    .create([
      {
        name: "Error",
        content: error.stack,
      },
    ])
    .then((res) => {
      user.send("**CHYBA!** \nČas: " + functions.curDT() + " \nChyba: ");
      user.send(res.url + " ");
    })
    .catch(console.error);
}

module.exports = {
  sendError,
};

mongoose.connection.on("err", async (error) => {
  console.error(err);

  var Gres = await Config.findOne({
    number: 1,
  });

  const user = bot.users.cache.find(
    (user) => user.id == Gres.botAdminDiscordID[0]
  );

  sourcebin
    .create([
      {
        name: "Error",
        content: error.stack,
      },
    ])
    .then((res) => {
      user.send("**CHYBA!** \nČas: " + functions.curDT() + " \nChyba: ");
      user.send(res.url + " ");
    })
    .catch(console.error);
});
