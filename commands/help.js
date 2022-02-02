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
const config = require("../config.json");
const template = require("string-placeholder");
const LMessages = require(`../messages/`);

module.exports = {
  name: "help",
  cooldown: 1,
  aliases: [],
  category: "help",
  execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
      return;
    if (!message.guild.me.permissions.has("EMBED_LINKS"))
      return message.channel.send(LMessages.help.noPermission);
    if (args[0] == null) {
      const helpEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor({
          name: config.name,
          iconURL: config.avatarUrl,
          url: config.webUrl,
        })
        .setDescription(LMessages.help.list)
        .setFooter({ text: LMessages.help.footer });

      for (const [key, value] of Object.entries(LMessages.help.categories)) {
        helpEmbed.addField(value.label, value.commands);
      }

      message.channel.send({ embeds: [helpEmbed] });
    } else if (args[0] != null) {
      if (LMessages.help.helpCommands.hasOwnProperty(args[0])) {
        var fullCommand = args[0];
        const commandEmbed = new Discord.MessageEmbed()
          .setColor(config.colors.green)
          .setTitle(
            template(
              LMessages.help.helpCommands.messages.help,
              { command: fullCommand.replace("_", " ") },
              { before: "%", after: "%" }
            )
          )
          .setAuthor({
            name: config.name,
            iconURL: config.avatarUrl,
            url: config.webUrl,
          });

        commandEmbed.addField(
          LMessages.help.helpCommands.labels.usage,
          LMessages.help.helpCommands[fullCommand].usage,
          true
        );

        if (LMessages.help.helpCommands[fullCommand].params != "") {
          commandEmbed.addField(
            LMessages.help.helpCommands.labels.params,
            LMessages.help.helpCommands[fullCommand].params,
            true
          );
        }

        commandEmbed.addField(
          LMessages.help.helpCommands.labels.description,
          LMessages.help.helpCommands[fullCommand].description,
          false
        );

        if (LMessages.help.helpCommands[fullCommand].aliases != "") {
          commandEmbed.addField(
            LMessages.help.helpCommands.labels.aliases,
            LMessages.help.helpCommands[fullCommand].aliases,
            true
          );
        }

        if (LMessages.help.helpCommands[fullCommand].required != "") {
          commandEmbed.addField(
            LMessages.help.helpCommands.labels.required,
            LMessages.help.helpCommands[fullCommand].required,
            true
          );
        }
        if (LMessages.help.helpCommands[fullCommand].permissions != "") {
          commandEmbed.addField(
            LMessages.help.helpCommands.labels.permissions,
            LMessages.help.helpCommands[fullCommand].permissions,
            true
          );
        }
        if (LMessages.help.helpCommands[fullCommand].exception != "") {
          commandEmbed.addField(
            LMessages.help.helpCommands.labels.exception,
            LMessages.help.helpCommands[fullCommand].exception,
            true
          );
        }

        commandEmbed.addField(
          LMessages.help.helpCommands.labels.category,
          LMessages.help.helpCommands[fullCommand].category,
          true
        );

        message.channel.send({ embeds: [commandEmbed] });
      } else {
        message.channel.send(LMessages.help.commandDoesntExist);

        return;
      }
    }
  },
};
