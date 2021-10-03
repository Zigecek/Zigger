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

module.exports = {
  name: "penis",
  cooldown: 1,
  aliases: [],
  category: "fun",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
      return;
    if (args[0]) {
      if (
        message.mentions.members.lenght == 0 ||
        message.mentions.members.lenght == null ||
        message.mentions.members.lenght == undefined
      ) {
        message.channel.send(
          template(
            LMessages.fun.penis.anything,
            { thing: args.join(" "), lenght: Rndm(1, 35) },
            { before: "%", after: "%" }
          )
        );
      } else if (message.mentions.members.lenght > 1) {
        let targetMember = message.mentions.members.first();

        message.channel.send(
          template(
            LMessages.fun.penis.member,
            { member: "<@" + targetMember.user.id + ">", lenght: Rndm(1, 35) },
            { before: "%", after: "%" }
          )
        );
      }
    } else {
      message.reply(
        template(
          LMessages.fun.penis.author,
          { lenght: Rndm(1, 35), mention: `<@${message.member.id}>` },
          { before: "%", after: "%" }
        )
      );
    }
  },
};

function Rndm(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
