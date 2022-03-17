
const template = require("string-placeholder");
const LMessages = require(`../messages/`);
const { blake2s } = require("hash-wasm");

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
        const length = await getScale(args.join(" "), [1, 35]);
        message.channel.send(
          template(
            LMessages.fun.penis.anything,
            { thing: args.join(" "), lenght: length },
            { before: "%", after: "%" }
          )
        );
      } else if (message.mentions.members.lenght > 1) {
        let targetMember = message.mentions.members.first();
        const length = await getScale(targetMember.user.id, [1, 35]);
        message.channel.send(
          template(
            LMessages.fun.penis.member,
            { member: "<@" + targetMember.user.id + ">", lenght: length },
            { before: "%", after: "%" }
          )
        );
      }
    } else {
      const length = await getScale(message.member.id, [1, 35]);
      message.reply(
        template(
          LMessages.fun.penis.author,
          { lenght: length, mention: `<@${message.member.id}>` },
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
  const hash = await blake2s(input, 8);

  return scaleValue(parseInt(hash, 16), [0, 255], to);
}
