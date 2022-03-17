
const error = require("../../utils/error");
const template = require("string-placeholder");
const Guild = require("../../models/guild");
const LMessages = require(`../../messages/`);

module.exports = {
  name: "volume",
  cooldown: 2,
  aliases: ["vol"],
  category: "music",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (
      !message.member.voice.channel ||
      message.member.voice.channel != message.guild.me.voice.channel
    ) {
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.need.toBeInVoiceWithBot);
      }
      return;
    }
    if (!args[0]) {
      if (
        !message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      )
        return;
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(
          template(
            LMessages.music.volume.currentVolume,
            { volume: Gres.musicBotVolume },
            { before: "%", after: "%" }
          )
        );
      }
      return;
    } else {
      if (Number(args[0]) >= 1 && Number(args[0]) <= 100) {
        await Guild.updateOne(
          {
            guildID: message.guild.id,
          },
          {
            musicBotVolume: Number(args[0]),
          }
        );

        if (serverQueue != undefined) {
          serverQueue.audioPlayer.state?.resource.volume.setVolume(
            Number(args[0]) / 100
          );
        }

        if (
          message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
        ) {
          message.channel.send(
            template(
              LMessages.music.volume.set,
              { volume: args[0] },
              { before: "%", after: "%" }
            )
          );
        }
        return;
      } else if (Number(args[0]) >= 1 && Gres.plus) {
        await Guild.updateOne(
          {
            guildID: message.guild.id,
          },
          {
            musicBotVolume: Number(args[0]),
          }
        );

        if (serverQueue != undefined) {
          serverQueue.audioPlayer.state?.resource.volume.setVolume(
            Number(args[0]) / 100
          );
        }

        if (
          message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
        ) {
          message.channel.send(
            template(
              LMessages.music.volume.set,
              { volume: args[0] },
              { before: "%", after: "%" }
            )
          );
        }
        return;
      } else {
        if (
          message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
        ) {
          message.channel.send(LMessages.music.volume.use);
        }
      }
    }
  },
};
