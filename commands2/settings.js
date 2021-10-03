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

const Guild = require("../models/guild.js");
const template = require("string-placeholder");
const error = require("../utils/error");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "settings",
  cooldown: 3,
  aliases: [],
  category: "settings",
  async execute(int, serverQueue, Gres) {
    if (int.member.permissions.has("ADMINISTRATOR")) {
      if (int.options.getSubcommandGroup() == "defaultvolume") {
        if (int.options.getSubcommand() == "set") {
          if (
            Number(int.options.get("volume").value) >= 1 &&
            Number(int.options.get("volume").value) <= 100
          ) {
            Guild.findOneAndUpdate(
              {
                guildID: int.guild.id,
              },
              {
                musicBotDefaultVolume: Number(int.options.get("volume").value),
                musicBotVolume: Number(int.options.get("volume").value),
              },
              function (err) {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }
              }
            );
            followReply(int, {
              content: template(
                LMessages.settings.dvol.set,
                { vol: int.options.get("volume").value },
                { before: "%", after: "%" }
              ),
            });
            return;
          } else {
            followReply(int, { content: LMessages.settings.dvol.invNumber });
            return;
          }
        } else if (int.options.getSubcommand() == "info") {
          template(
            LMessages.settings.dvol.vol,
            { vol: Gres.musicBotDefaultVolume },
            { before: "%", after: "%" }
          );
          return;
        }
      } else if (int.options.getSubcommand() == "blacklist") {
        if (int.options.getSubcommand() == "info") {
          var channels = int.guild.channels
            .fetch()
            .filter((x) => Gres.blacklist.includes(x.id));
          followReply(int, {
            content: template(
              LMessages.settings.blacklist.info,
              { channels: channels.map((x) => `\n <#${x.id}>`) },
              { before: "%", after: "%" }
            ),
          });
          return;
        } else if (int.options.getSubcommand() == "add") {
          var channels = new Discord.Collection();
          for (var i = 1; i <= 9; i++) {
            var chann = int.options.getChannel(`channel${i}`);
            channels.set(chann.id, chann);
          }
          if (channels.size == 0) {
            return followReply(int, {
              content: LMessages.settings.blacklist.specifyChannels,
            });
          }
          var ar = [];
          channels.forEach((ch) => {
            if (Gres.blacklist.includes(ch.id)) {
              ar.push(ch.id);
              channels.delete(ch);
              return;
            }
            Guild.updateOne(
              {
                guildID: int.guild.id,
              },
              {
                $push: { blacklist: ch.id },
              },
              (err) => {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }
              }
            );
          });
          if (ar.length >= 1) {
            followReply(int, {
              content: template(LMessages.settings.blacklist.alreadyAdded, {
                channels: ar.map((x) => `\n <#${x.id}>`),
              }),
            });
          }
          if (channels.size >= 1) {
            followReply(int, {
              content: template(
                LMessages.settings.blacklist.succesful,
                {
                  channels: channels.map((x) => `\n <#${x.id}>`),
                },
                { before: "%", after: "%" }
              ),
            });
          }
          return;
        } else if (int.options.getSubcommand() == "remove") {
          var channels = new Discord.Collection();
          for (var i = 1; i <= 9; i++) {
            var chann = int.options.getChannel(`channel${i}`);
            channels.set(chann.id, chann);
          }
          if (channels.size == 0) {
            return followReply(int, {
              content: LMessages.settings.blacklist.specifyChannels,
            });
          }
          var ar = [];
          channels.forEach((ch) => {
            if (!Gres.blacklist.includes(ch.id)) {
              ar.push(ch.id);
              channels.delete(ch);
              return;
            }
            Guild.updateOne(
              {
                guildID: int.guild.id,
              },
              {
                $pull: { blacklist: ch.id },
              },
              (err) => {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }
              }
            );
          });
          if (ar.length >= 1) {
            followReply(int, {
              content: template(LMessages.settings.blacklist.channelIsnt, {
                channels: ar.map((x) => `\n <#${x.id}>`),
              }),
            });
          }
          if (channels.size >= 1) {
            followReply(int, {
              content: template(
                LMessages.settings.blacklist.succesfulRemove,
                {
                  channels: channels.map((x) => `\n <#${x.id}>`),
                },
                { before: "%", after: "%" }
              ),
            });
          }
        }
      } else if (int.options.getSubcommandGroup() == "annouce") {
        if (int.options.getSubcommand() == "set") {
          Guild.findOneAndUpdate(
            {
              guildID: int.guild.id,
            },
            {
              annouce: int.options.get("mode").value,
            },
            function (err) {
              if (err) {
                console.error(err);
                error.sendError(err);
                return;
              }
            }
          );
          followReply(int, {
            content: template(
              LMessages.settings.annouce.set,
              {
                mode:
                  int.options.get("mode").value == 0
                    ? "Off"
                    : int.options.get("mode").value == 1
                    ? "Full"
                    : "Short",
              },
              { before: "%", after: "%" }
            ),
          });
        } else if (int.options.getSubcommand() == "info") {
          followReply(int, {
            content: template(
              LMessages.settings.annouce.mode,
              {
                mode:
                  Gres.annouce == 1
                    ? "Full"
                    : Gres.annouce == 0
                    ? "Off"
                    : "Short",
              },
              { before: "%", after: "%" }
            ),
          });
          return;
        }
      } else {
        followReply(int, { content: LMessages.settings.useHelp });
        return;
      }
    } else {
      followReply(int, { content: LMessages.noPermission });
    }
  },
};
