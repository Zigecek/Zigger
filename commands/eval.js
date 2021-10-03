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

const Config = require("../models/Config");
const error = require("../utils/error");
const LMessages = require(`../messages/`);

module.exports = {
  name: "eval",
  cooldown: 1,
  aliases: [],
  category: "dev",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    var Cres = await Config.findOne(
      {
        number: 1,
      },
      (err, Cres) => {
        if (err) {
          console.error(err);
          error.sendError(err);
          return;
        } else {
          return Cres;
        }
      }
    );

    if (Cres.botAdminDiscordID.includes(message.author.id)) {
      var string = args.join(" ");

      let result = await eval(string);

      message.channel.send("**RESULT: ** \n```JS\n" + result + "\n```");
    } else {
      message.channel.send(LMessages.noPermission);
    }
  },
};
