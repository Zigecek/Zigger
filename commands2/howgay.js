const Discord = require("discord.js");
const template = require("string-placeholder");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");
const { blake3 } = require("hash-wasm");

module.exports = {
  name: "howgay",
  cooldown: 1,
  aliases: ["hg"],
  category: "fun",
  async execute(int, serverQueue, Gres) {
    if (
      !int.channel
        .permissionsFor(int.guild.members.me)
        .has(Discord.PermissionFlagsBits.SendMessages)
    )
      return;
    if (
      int.options.get("anything")?.value ||
      int.options.get("anything")?.member
    ) {
      if (int.options.get("anything").member) {
        const hg = await getScale(
          int.options.get("anything").member.id,
          [0, 100]
        );
        followReply(int, {
          content: template(
            LMessages.fun.howGay.member,
            {
              member: "<@" + int.options.get("anything").member.id + ">",
              percent: hg,
            },
            { before: "%", after: "%" }
          ),
        });
      } else {
        const hg = await getScale(int.options.get("anything").value, [0, 100]);
        followReply(int, {
          content: template(
            LMessages.fun.howGay.anything,
            { thing: int.options.get("anything").value, percent: hg },
            { before: "%", after: "%" }
          ),
        });
      }
    } else {
      const hg = await getScale(int.member.id, [0, 100]);

      followReply(int, {
        content: template(
          LMessages.fun.howGay.author,
          { percent: hg, mention: `<@!${int.member.id}>` },
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
  const hash = await blake3(input, 8);

  return scaleValue(parseInt(hash, 16), [0, 255], to);
}
