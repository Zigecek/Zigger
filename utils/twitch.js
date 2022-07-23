const Discord = require("discord.js");
const Guild = require("../models/guild.js");
const Streams = require("../models/streamguilds.js");
const request = require("request");
const error = require("./error");
const { bot } = require("../bot");
const config = require("../config.js");
const sec2human = require("sec2human");

const ready = () => {
  console.log(" ");
  console.log("Twitch - Oznamuju.");
  callLoop();
};

function callLoop() {
  setInterval(async () => {
    var Sres = await Streams.findOne({
      note: "555",
    });
    if (Sres.guildIDs) {
      var Gres = await Guild.find({});
      if (Gres) {
        Gres.filter((x) => Sres.guildIDs.includes(x.guildID));
        Gres.forEach(async (e) => {
          if (e.streamUserID) {
            let Tres = await getStream(process.env.TWITCH_ID, e.streamUserID);

            if (Tres) {
              if (Tres.stream == null) {
                await Guild.updateOne(
                  {
                    guildID: e.guildID,
                  },
                  {
                    stream: false,
                  }
                );
              } else {
                if (e.stream != true) {
                  await Guild.updateOne(
                    {
                      guildID: e.guildID,
                    },
                    {
                      stream: true,
                    }
                  );

                  var currentTime = new Date();
                  var createdTime = new Date(Tres.stream.created_at);
                  var messageTime = sec2human(
                    Math.floor(currentTime.getTime() / 1000) -
                      Math.floor(createdTime.getTime() / 1000)
                  );

                  const streamEmbed = new Discord.EmbedBuilder()
                    .setColor(config.colors.purple)
                    .setTitle(Tres.stream.channel.status)
                    .setURL(Tres.stream.channel.url)
                    .setAuthor({
                      name: config.name,
                      iconURL: config.avatarUrl,
                      url: config.webUrl,
                    })
                    .setThumbnail(Tres.stream.channel.logo)
                    .setDescription("@everyone Come to the stream!")
                    .addFields([
                      {
                        name: "Game",
                        value: Tres.stream.channel.game + ".",
                        inline: true,
                      },
                      {
                        name: "Duration:",
                        value: messageTime + " ",
                        inline: true,
                      },
                    ])
                    .setImage(Tres.stream.preview.large)
                    .setFooter({
                      text: config.name,
                      iconURL: config.avatarUrl,
                    });

                  let chan = bot.channels.cache.get(e.streamNotifyChannelID);

                  if (chan) {
                    if (
                      chan.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)
                    ) {
                      if (
                        chan.guild.members.me.permissions.has(Discord.PermissionFlagsBits.EmbedLinks)
                      ) {
                        var message = await chan.send({
                          embeds: [streamEmbed],
                        });
                        await Guild.updateOne(
                          {
                            guildID: e.guildID,
                          },
                          {
                            streamMessageID: message.id,
                            streamMessageChannelID: e.streamNotifyChannelID,
                          }
                        );
                      }
                    }
                  } else {
                    await Guild.updateOne(
                      {
                        guildID: e.guildID,
                      },
                      {
                        streamNotifyChannelID: null,
                      }
                    );
                  }

                  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                } else if (e.stream == true) {
                  var currentTime = new Date();
                  var createdTime = new Date(Tres.stream.created_at);
                  var messageTime = sec2human(
                    Math.floor(currentTime.getTime() / 1000) -
                      Math.floor(createdTime.getTime() / 1000)
                  );

                  const streamEmbed = new Discord.EmbedBuilder()
                    .setColor(config.colors.purple)
                    .setTitle(Tres.stream.channel.status)
                    .setURL(Tres.stream.channel.url)
                    .setAuthor({
                      name: config.name,
                      iconURL: config.avatarUrl,
                      url: config.webUrl,
                    })
                    .setThumbnail(Tres.stream.channel.logo)
                    .setDescription("@everyone Come to the stream!")
                    .addFields([
                      {
                        name: "Game",
                        value: Tres.stream.channel.game + ".",
                        inline: true,
                      },
                      {
                        name: "Duration:",
                        value: messageTime + " ",
                        inline: true,
                      },
                    ])
                    .setImage(Tres.stream.preview.large)
                    .setFooter({
                      text: config.name,
                      iconURL: config.avatarUrl,
                    });
                  let channel = bot.channels.cache.get(
                    e.streamMessageChannelID
                  );
                  if (channel) {
                    if (
                      channel.guild.members.me.permissions.has(Discord.PermissionFlagsBits.EmbedLinks)
                    ) {
                      let message = channel.messages.cache.get(
                        e.streamMessageID
                      );
                      if (message) {
                        if (
                          message.guild.members.me.permissions.has([
                            Discord.PermissionFlagsBits.ManageMessages,
                            Discord.PermissionFlagsBits.SendMessages,
                          ])
                        ) {
                          message.edit({ embeds: [streamEmbed] });
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            return;
          }
        });
      }
    }
  }, 10000);
}

const getStream = async (clientID, channelID) => {
  request.get(
    `https://api.twitch.tv/kraken/streams/${channelID}`,
    {
      json: true,
      headers: {
        Accept: "application/vnd.twitchtv.v5+json",
        "Client-ID": `${clientID}`,
      },
    },
    (err, res, body) => {
      if (err) {
        return err;
      }
      return body;
    }
  );
};

module.exports = {
  events: {
    ready: ready,
  },
};
