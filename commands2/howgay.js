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
  name: "howgay",
  cooldown: 1,
  aliases: ["hg"],
  category: "fun",
  async execute(int, serverQueue, Gres) {
    if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) return;
    if (int.options.get("anything").value) {
      if (int.options.get("anything").member) {
        followReply(int, {
          content: template(
            LMessages.fun.howGay.member,
            {
              member: "<@" + int.options.get("anything").member.id + ">",
              percent: Rndm(0, 100),
            },
            { before: "%", after: "%" }
          ),
        });
      } else {
        followReply(int, {
          content: template(
            LMessages.fun.howGay.anything,
            { thing: int.options.get("anything").value, percent: Rndm(0, 100) },
            { before: "%", after: "%" }
          ),
        });
      }
    } else {
      followReply(int, {
        content: template(
          LMessages.fun.howGay.author,
          { percent: Rndm(0, 100), mention: `<@!${int.member.id}>` },
          { before: "%", after: "%" }
        ),
      });
    }
  },
};

function Rndm(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
