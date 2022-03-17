
const error = require("../../utils/error");
const template = require("string-placeholder");
const Guild = require("../../models/guild");
const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "volume",
  cooldown: 2,
  aliases: ["vol"],
  category: "music",
  async execute(int, serverQueue, Gres) {
    if (
      !int.member.voice.channel ||
      int.member.voice.channel != int.guild.me.voice.channel
    ) {
      if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
        followReply(int, { content: LMessages.music.need.toBeInVoiceWithBot });
      }
      return;
    }
    if (!int.options.get("volume").value) {
      if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES"))
        return;
      if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
        followReply(int, {
          content: template(
            LMessages.music.volume.currentVolume,
            { volume: Gres.musicBotVolume },
            { before: "%", after: "%" }
          ),
        });
      }
      return;
    } else {
      if (
        Number(int.options.get("volume").value) >= 1 &&
        Number(int.options.get("volume").value) <= 100
      ) {
        await Guild.updateOne(
          {
            guildID: int.guild.id,
          },
          {
            musicBotVolume: Number(int.options.get("volume").value),
          }
        );

        if (serverQueue != undefined) {
          serverQueue.audioPlayer.state?.resource.volume.setVolume(
            Number(int.options.get("volume").value) / 100
          );
        }

        if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
          followReply(int, {
            content: template(
              LMessages.music.volume.set,
              { volume: int.options.get("volume").value },
              { before: "%", after: "%" }
            ),
          });
        }
        return;
      } else if (Number(int.options.get("volume").value) >= 1 && Gres.plus) {
        await Guild.updateOne(
          {
            guildID: int.guild.id,
          },
          {
            musicBotVolume: Number(int.options.get("volume").value),
          }
        );

        if (serverQueue != undefined) {
          serverQueue.audioPlayer.state?.resource.volume.setVolume(
            Number(int.options.get("volume").value) / 100
          );
        }

        if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
          followReply(int, {
            content: template(
              LMessages.music.volume.set,
              { volume: int.options.get("volume").value },
              { before: "%", after: "%" }
            ),
          });
        }
        return;
      } else {
        if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
          followReply(int, { content: LMessages.music.volume.use });
        }
      }
    }
  },
};
