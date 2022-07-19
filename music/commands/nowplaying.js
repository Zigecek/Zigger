const Discord = require("discord.js");
const sec2human = require("sec2human");
const config = require("../../config.js");
const LMessages = require(`../../messages/`);

module.exports = {
  name: "nowplaying",
  cooldown: 3,
  aliases: ["np", "playing"],
  category: "music",
  execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    const start = "╞";
    const end = "╡";
    const prog = "═";
    const curs = "🔘";
    if (
      !message.channel
        .permissionsFor(message.guild.members.me)
        .has("SEND_MESSAGES")
    )
      return;
    if (serverQueue) {
      const fourPer = serverQueue.songs[0].sDur / 25;
      const elSecs = Math.floor(
        (Date.now() - Gres.musicBotPlayTime.getTime()) / 1000
      );
      const nonElSecs = serverQueue.songs[0].sDur - elSecs;

      const Embed = new Discord.EmbedBuilder()
        .setColor(config.colors.red)
        .setTitle(LMessages.musicNowPlaying)
        .setThumbnail(serverQueue.songs[0].thumbnail)
        .addFields(
          {
            name: LMessages.musicName,
            value: `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`,
          },
          {
            name: LMessages.musicAuthor,
            value: serverQueue.songs[0].author,
          }
        );
      if (serverQueue.songs[0].duration == "LIVE!") {
        Embed.addFields([
          {
            name: LMessages.musicDuration,
            value: serverQueue.songs[0].duration,
          },
        ]);
      } else {
        Embed.addFields([
          {
            name: LMessages.musicProgress,
            value:
              sec2human(elSecs) +
              " / " +
              serverQueue.songs[0].duration +
              " " +
              (start +
                prog.repeat(Math.floor(elSecs / fourPer)) +
                curs +
                prog.repeat(Math.floor(nonElSecs / fourPer)) +
                end),
          },
        ]);
      }
      if (
        message.channel
          .permissionsFor(message.guild.members.me)
          .has("SEND_MESSAGES")
      ) {
        if (message.guild.members.me.permissions.has("EMBED_LINKS")) {
          message.channel.send({ embeds: [Embed] });
        } else {
          message.channel.send(
            LMessages.musicNowPlaying +
              "\n" +
              "`" +
              serverQueue.songs[0].title +
              "` (" +
              serverQueue.songs[0].duration +
              ")"
          );
        }
      }
    } else {
      if (
        message.channel
          .permissionsFor(message.guild.members.me)
          .has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.musicNothingPlaying);
      }
    }
  },
};
