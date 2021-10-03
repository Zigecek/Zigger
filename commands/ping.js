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

module.exports = {
  name: "ping",
  cooldown: 1,
  aliases: [],
  category: "other",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
      return;

    message.channel.send(LMessages.pingingMessage).then((resultMessage) => {
      const ping = resultMessage.createdTimestamp - message.createdTimestamp;

      resultMessage.edit(
        template(
          LMessages.pingMessage,
          { delay: ping, apiDelay: bot.ws.ping },
          { before: "%", after: "%" }
        )
      );
    });
  },
};
