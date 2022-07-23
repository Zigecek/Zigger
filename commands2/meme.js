const Discord = require("discord.js");
const request = require("request");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "meme",
  aliases: [],
  cooldown: 2,
  category: "fun",
  execute(int, serverQueue, Gres) {
    if (
      !int.channel
        .permissionsFor(int.guild.members.me)
        .has(Discord.PermissionFlagsBits.SendMessages)
    )
      return;
    if (
      !int.guild.members.me.permissions.has(
        Discord.PermissionFlagsBits.EmbedLinks
      )
    )
      return followReply(int, { content: LMessages.help.noPermission });
    meme(int);
  },
};

async function meme(int) {
  var body = await getMEME();
  const Embed = new Discord.EmbedBuilder()
    .setColor("RANDOM")
    .setImage(body.url);
  followReply(int, { embeds: [Embed] });
}
const getMEME = () => {
  return new Promise((resolve, reject) => {
    request.get(
      `https://meme-api.herokuapp.com/gimme`,
      {
        json: true,
      },
      (err, res, body) => {
        if (err) {
          reject(err);
        }
        resolve(body);
      }
    );
  });
};
