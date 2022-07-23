const Discord = require("discord.js");
const config = require("../config.js");
const template = require("string-placeholder");
const LMessages = require(`../messages/`);

module.exports = {
  name: "help",
  cooldown: 1,
  aliases: [],
  category: "help",
  execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (
      !message.channel
        .permissionsFor(message.guild.members.me)
        .has(Discord.PermissionFlagsBits.SendMessages)
    )
      return;
    if (
      !message.guild.members.me.permissions.has(
        Discord.PermissionFlagsBits.EmbedLinks
      )
    )
      return message.channel.send(LMessages.help.noPermission);
    if (args[0] == null) {
      const helpEmbed = new Discord.EmbedBuilder()
        .setColor(config.colors.green)
        .setAuthor({
          name: config.name,
          iconURL: config.avatarUrl,
          url: config.webUrl,
        })
        .setDescription(LMessages.help.list)
        .setFooter({ text: LMessages.help.footer });

      for (const [key, value] of Object.entries(LMessages.help.categories)) {
        helpEmbed.addFields([{ name: value.label, value: value.commands }]);
      }

      message.channel.send({ embeds: [helpEmbed] });
    } else if (args[0] != null) {
      if (LMessages.help.helpCommands.hasOwnProperty(args[0])) {
        var fullCommand = args[0];
        const commandEmbed = new Discord.EmbedBuilder()
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

        commandEmbed.addFields([
          {
            name: LMessages.help.helpCommands.labels.usage,
            value: LMessages.help.helpCommands[fullCommand].usage,
            inline: true,
          },
        ]);

        if (LMessages.help.helpCommands[fullCommand].params != "") {
          commandEmbed.addFields([
            {
              name: LMessages.help.helpCommands.labels.params,
              value: LMessages.help.helpCommands[fullCommand].params,
              inline: true,
            },
          ]);
        }

        commandEmbed.addFields([
          {
            name: LMessages.help.helpCommands.labels.description,
            value: LMessages.help.helpCommands[fullCommand].description,
            inline: false,
          },
        ]);

        if (LMessages.help.helpCommands[fullCommand].aliases != "") {
          commandEmbed.addFields([
            {
              name: LMessages.help.helpCommands.labels.aliases,
              value: LMessages.help.helpCommands[fullCommand].aliases,
              inline: true,
            },
          ]);
        }

        if (LMessages.help.helpCommands[fullCommand].required != "") {
          commandEmbed.addFields([
            {
              name: LMessages.help.helpCommands.labels.required,
              value: LMessages.help.helpCommands[fullCommand].required,
              inline: true,
            },
          ]);
        }
        if (LMessages.help.helpCommands[fullCommand].permissions != "") {
          commandEmbed.addFields([
            {
              name: LMessages.help.helpCommands.labels.permissions,
              value: LMessages.help.helpCommands[fullCommand].permissions,
              inline: true,
            },
          ]);
        }
        if (LMessages.help.helpCommands[fullCommand].exception != "") {
          commandEmbed.addFields([
            {
              name: LMessages.help.helpCommands.labels.exception,
              value: LMessages.help.helpCommands[fullCommand].exception,
              inline: true,
            },
          ]);
        }

        commandEmbed.addFields([
          {
            name: LMessages.help.helpCommands.labels.category,
            value: LMessages.help.helpCommands[fullCommand].category,
            inline: true,
          },
        ]);

        message.channel.send({ embeds: [commandEmbed] });
      } else {
        message.channel.send(LMessages.help.commandDoesntExist);

        return;
      }
    }
  },
};
