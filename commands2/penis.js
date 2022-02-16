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

const template = require("string-placeholder");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "penis",
  cooldown: 1,
  aliases: [],
  category: "fun",
  async execute(int, serverQueue, Gres) {
    if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) return;
    if (int.options.get("anything")?.value) {
      if (int.options.get("anything")?.member) {
        followReply(int, {
          content: template(
            LMessages.fun.penis.member,
            {
              member: "<@" + int.options.get("anything").member.user.id + ">",
              lenght: Rndm(1, 35),
            },
            { before: "%", after: "%" }
          ),
        });
      } else {
        followReply(int, {
          content: template(
            LMessages.fun.penis.anything,
            { thing: int.options.get("anything").value, lenght: Rndm(1, 35) },
            { before: "%", after: "%" }
          ),
        });
      }
    } else if (int.options.get("anything")?.value == null) {
      followReply(int, {
        content: template(
          LMessages.fun.penis.author,
          { lenght: Rndm(1, 35), mention: `<@!${int.member.id}>` },
          { before: "%", after: "%" }
        ),
      });
    }
  },
};

function Rndm(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
