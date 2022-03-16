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
  name: "invite",
  cooldown: 3,
  aliases: [],
  category: "other",
  execute(int, serverQueue, Gres) {
    if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) return;
    if (
      !int.member.voice.channel
        ?.permissionsFor(int.guild.me)
        .has("CREATE_INSTANT_INVITE") ||
      !int.guild.me.permissions.has("CREATE_INSTANT_INVITE")
    ) {
      followReply(int, { content: LMessages.botNoPermission });

      return;
    }
    if (int.member.voice.channel) {
      int.member.voice.channel
        .createInvite({
          maxAge: 86400,
          maxUses: 10,
          unique: true,
          reason: "Created invite for request.",
        })
        .then((invite) => {
          followReply(int, {
            content: template(
              LMessages.newInvite,
              { url: invite.url },
              { before: "%", after: "%" }
            ),
          });
        });
    } else {
      int.channel
        .createInvite({
          maxAge: 86400,
          maxUses: 10,
          unique: true,
          reason: "Created invite for request.",
        })
        .then((invite) => {
          followReply(int, {
            content: template(
              LMessages.newInvite,
              { url: invite.url },
              { before: "%", after: "%" }
            ),
          });
        });
    }
  },
};
