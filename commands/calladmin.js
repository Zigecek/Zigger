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

const Config = require("../models/Config");
const botFile = require("../bot");
const error = require("../utils/error");
const LMessages = require(`../messages/`);

module.exports = {
  name: "calladmin",
  cooldown: 180,
  aliases: ["ca"],
  category: "settings",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    var Gres = await Config.findOne({
      number: 1,
    });

    let admin = message.guild.members.cache.get(Gres.botAdminDiscordID[0]);

    if (admin) {
      admin.send(
        "**Error:** " + message.url + " \nGuildID:" + message.guild.id
      );

      message.channel.send(LMessages.adminNotified);

      return;
    } else {
      message.channel.send(LMessages.error);
    }
  },
};
