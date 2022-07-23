const Discord = require("discord.js");
const fetch = require("cross-fetch");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "urban",
  aliases: [],
  cooldown: 3,
  category: "fun",
  execute(int, serverQueue, Gres) {
    if (
      !int.channel
        .permissionsFor(int.guild.members.me)
        .has(Discord.PermissionFlagsBits.SendMessages)
    )
      return;
    if (
      !int.guild.members.me.permissions.has(
        Discord.PermissionFlagsBits.EmbedLinks
      )
    )
      return followReply(int, { content: LMessages.help.noPermission });
    get(int);
  },
};

async function get(int) {
  const term = int.options.get("query").value;
  const query = new URLSearchParams({ term });

  const res = await fetch(
    `https://api.urbandictionary.com/v0/define?${query}`
  ).then((response) => response.json());
  var body = res.list;
  if (body.length == 0) {
    followReply(int, { content: LMessages.urban.nothingFound });
    return;
  }
  var index = 0;

  function getRow(ind, bod) {
    ind = Number(ind);
    return new Discord.ActionRowBuilder().setComponents([
      new Discord.ButtonBuilder()
        .setCustomId("prev")
        .setLabel("←")
        .setStyle(Discord.ButtonStyle.Primary)
        .setDisabled(ind == 0 ? true : false),
      new Discord.ButtonBuilder()
        .setCustomId("next")
        .setLabel("→")
        .setStyle(Discord.ButtonStyle.Primary)
        .setDisabled(index == bod.length - 1 ? true : false),
    ]);
  }
  function getEmbed(ind, bod) {
    ind = Number(ind);
    return new Discord.EmbedBuilder()
      .setColor("NOT_QUITE_BLACK")
      .setURL(bod[ind].permalink)
      .setTitle(bod[ind].word)
      .setDescription(bod[ind].definition)
      .addFields([{ name: "Example", value: bod[ind].example, inline: false }])
      .setFooter({
        text: `by ${bod[ind].author} \n👍${bod[ind].thumbs_up} 👎${
          bod[ind].thumbs_down
        } \nPage: ${index + 1}/${bod.length}`,
      });
  }

  followReply(int, {
    embeds: [getEmbed(index, body)],
    components: [getRow(index, body)],
  }).then((msg) => {
    const filter = (inter) => inter.member.id == int.member.id;
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 2 * 60 * 60_000,
    });
    collector
      .on("collect", (interact) => {
        if (!interact.isButton()) return;
        var id = interact.component.customId;
        if (id == "prev") {
          if (index == 0) return;
          index -= 1;
          if (msg.editable) {
            msg.edit({
              embeds: [getEmbed(index, body)],
              components: [getRow(index, body)],
            });
            interact.deferUpdate();
          }
        } else if (id == "next") {
          if (index == body.length - 1) return;
          index += 1;
          if (msg.editable) {
            msg.edit({
              embeds: [getEmbed(index, body)],
              components: [getRow(index, body)],
            });
            interact.deferUpdate();
          }
        }
      })
      .on("end", () => {
        if (msg) {
          msg.components.forEach((r) => {
            r.components.forEach((b) => {
              b.setDisabled(true);
            });
          });
        }
      });
  });
}
