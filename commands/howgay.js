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
const { blake3 } = require("hash-wasm");

module.exports = {
  name: "howgay",
  cooldown: 1,
  aliases: ["hg"],
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
        const hg = await getScale(args.join(" "), [0, 100]);
        message.channel.send(
          template(
            LMessages.fun.howGay.anything,
            { thing: args.join(" "), percent: hg },
            { before: "%", after: "%" }
          )
        );
      } else if (message.mentions.members.lenght > 1) {
        let targetMember = message.mentions.members.first();
        const hg = await getScale(targetMember.user.id, [0, 100]);
        message.channel.send(
          template(
            LMessages.fun.howGay.member,
            {
              member: "<@" + targetMember.user.id + ">",
              percent: hg,
            },
            { before: "%", after: "%" }
          )
        );
      }
    } else {
      const hg = await getScale(message.member.id, [0, 100]);
      message.reply(
        template(
          LMessages.fun.howGay.author,
          { percent: hg, mention: `<@${message.member.id}>` },
          { before: "%", after: "%" }
        )
      );
    }
  },
};

async function getScale(string, to) {
  function scaleValue(value, from, to) {
    var scale = (to[1] - to[0]) / (from[1] - from[0]);
    var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
    return ~~(capped * scale + to[0]);
  }

  var input = string.trim().toLowerCase();
  const hash = await blake3(input, 8);

  return scaleValue(parseInt(hash, 16), [0, 255], to);
}
