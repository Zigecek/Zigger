
const template = require("string-placeholder");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");
const { blake2s } = require("hash-wasm");

module.exports = {
  name: "penis",
  cooldown: 1,
  aliases: [],
  category: "fun",
  async execute(int, serverQueue, Gres) {
    if (!int.channel.permissionsFor(int.guild.members.me).has("SEND_MESSAGES")) return;
    if (
      int.options.get("anything")?.value ||
      int.options.get("anything")?.member
    ) {
      if (int.options.get("anything").member) {
        const length = await getScale(
          int.options.get("anything").member.user.id,
          [1, 35]
        );
        followReply(int, {
          content: template(
            LMessages.fun.penis.member,
            {
              member: "<@" + int.options.get("anything").member.user.id + ">",
              lenght: length,
            },
            { before: "%", after: "%" }
          ),
        });
      } else {
        const length = await getScale(
          int.options.get("anything").value,
          [1, 35]
        );

        followReply(int, {
          content: template(
            LMessages.fun.penis.anything,
            { thing: int.options.get("anything").value, lenght: length },
            { before: "%", after: "%" }
          ),
        });
      }
    } else {
      const length = await getScale(int.member.id, [1, 35]);

      followReply(int, {
        content: template(
          LMessages.fun.penis.author,
          { lenght: length, mention: `<@!${int.member.id}>` },
          { before: "%", after: "%" }
        ),
      });
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
