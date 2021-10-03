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
const template = require("string-placeholder");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "ping",
  cooldown: 1,
  aliases: [],
  category: "other",
  async execute(int, serverQueue, Gres) {
    if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) return;

    followReply(int, { content: LMessages.pingingMessage }).then(
      (resultMessage) => {
        const ping = resultMessage.createdTimestamp - int.createdTimestamp;

        resultMessage.edit(
          template(
            LMessages.pingMessage,
            { delay: ping, apiDelay: bot.ws.ping },
            { before: "%", after: "%" }
          )
        );
      }
    );
  },
};
