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

const Discord = require("discord.js");
const request = require("request");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "meme",
  aliases: [],
  cooldown: 2,
  category: "fun",
  async execute(int, serverQueue, Gres) {
    if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) return;
    if (!int.guild.me.permissions.has("EMBED_LINKS"))
      return followReply(int, { content: LMessages.help.noPermission });
    meme(int);
  },
};

async function meme(int) {
  var body = await getMEME();
  const Embed = new Discord.MessageEmbed()
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
