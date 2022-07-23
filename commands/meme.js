
const Discord = require("discord.js");
const request = require("request");
const LMessages = require(`../messages/`);

module.exports = {
  name: "meme",
  aliases: [],
  cooldown: 2,
  category: "fun",
  execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (!message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages))
      return;
    if (!message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.EmbedLinks))
      return message.channel.send(LMessages.help.noPermission);
    meme(message);
  },
};

async function meme(message) {
  var body = await getMEME();
  const Embed = new Discord.EmbedBuilder()
    .setColor("RANDOM")
    .setImage(body.url);
  message.channel.send({ embeds: [Embed] });
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
