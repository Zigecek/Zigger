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
const { followReply } = require("../utils/functions");

module.exports = {
  name: "calladmin",
  cooldown: 180,
  aliases: ["ca"],
  category: "settings",
  async execute(int, serverQueue, Gres) {
    Config.findOne(
      {
        number: 1,
      },
      (err, Gres) => {
        if (err) {
          console.error(err);
          error.sendError(err);
          return;
        }

        let admin = int.guild.members.cache.get(Gres.botAdminDiscordID[0]);

        if (admin) {
          admin.send("**Error:** " + int.url + " \nGuildID:" + int.guild.id);

          followReply(int, { content: LMessages.adminNotified });

          return;
        } else {
          followReply(int, { content: LMessages.error });
        }
      }
    );
  },
};
