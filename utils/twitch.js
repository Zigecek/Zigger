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
const Guild = require("../models/guild.js");
const Streams = require("../models/streamguilds.js");
const request = require("request");
const error = require("./error");
const { bot } = require("../bot");
const config = require("../config.json");
const sec2human = require("sec2human");

const ready = () => {
  console.log(" ");
  console.log("Twitch - Oznamuju.");
  callLoop();
};

async function callLoop() {
  setInterval(async () => {
    let Sres = await Streams.findOne(
      {
        note: "555",
      },
      (err, Sres) => {
        if (err) {
          console.error(err);
          error.sendError(err);
          return;
        }

        return Sres;
      }
    );
    if (Sres.guildIDs) {
      let Gres = await Guild.find({}, (err, Gres) => {
        if (err) {
          console.error(err);
          error.sendError(err);
          return;
        }
        return Gres;
      });
      if (Gres) {
        Gres.filter((x) => Sres.guildIDs.includes(x.guildID));
        Gres.forEach(async (e) => {
          if (e.streamUserID) {
            let Tres = await getStream(process.env.TWITCH_ID, e.streamUserID);

            if (Tres) {
              if (Tres.stream == null) {
                Guild.findOneAndUpdate(
                  {
                    guildID: e.guildID,
                  },
                  {
                    stream: false,
                  },
                  function (err) {
                    if (err) {
                      console.error(err);
                      error.sendError(err);
                      return;
                    }
                  }
                );
              } else {
                if (e.stream != true) {
                  Guild.findOneAndUpdate(
                    {
                      guildID: e.guildID,
                    },
                    {
                      stream: true,
                    },
                    function (err) {
                      if (err) {
                        console.error(err);
                        error.sendError(err);
                        return;
                      }
                    }
                  );

                  var currentTime = new Date();
                  var createdTime = new Date(Tres.stream.created_at);
                  var messageTime = sec2human(
                    Math.floor(currentTime.getTime() / 1000) -
                      Math.floor(createdTime.getTime() / 1000)
                  );

                  const streamEmbed = new Discord.MessageEmbed()
                    .setColor(config.colors.purple)
                    .setTitle(Tres.stream.channel.status)
                    .setURL(Tres.stream.channel.url)
                    .setAuthor(e.streamUserName, Tres.stream.channel.logo)
                    .setThumbnail(Tres.stream.channel.logo)
                    .setDescription("@everyone Come to the stream!")
                    .addField("Game", Tres.stream.channel.game + ".", true)
                    .addField("Duration:", messageTime + " ", true)
                    .setImage(Tres.stream.preview.large)
                    .setFooter(config.name, config.avatarUrl);

                  let chan = bot.channels.cache.get(e.streamNotifyChannelID);

                  if (chan) {
                    if (chan.guild.me.permissions.has("SEND_MESSAGES")) {
                      if (chan.guild.me.permissions.has("EMBED_LINKS")) {
                        var message = await chan.send({
                          embeds: [streamEmbed],
                        });
                        Guild.findOneAndUpdate(
                          {
                            guildID: e.guildID,
                          },
                          {
                            streamMessageID: message.id,
                            streamMessageChannelID: e.streamNotifyChannelID,
                          },
                          (err, result) => {
                            if (err) {
                              console.error(err);
                              error.sendError(err);
                              return;
                            }
                          }
                        );
                      }
                    }
                  } else {
                    Guild.findOneAndUpdate(
                      {
                        guildID: e.guildID,
                      },
                      {
                        streamNotifyChannelID: null,
                      },
                      (err, result) => {
                        if (err) {
                          console.error(err);
                          error.sendError(err);
                          return;
                        }
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

                  const streamEmbed = new Discord.MessageEmbed()
                    .setColor(config.colors.purple)
                    .setTitle(Tres.stream.channel.status)
                    .setURL(Tres.stream.channel.url)
                    .setAuthor(e.streamUserName, Tres.stream.channel.logo)
                    .setThumbnail(Tres.stream.channel.logo)
                    .setDescription("@everyone Come to the stream!")
                    .addField("Game", Tres.stream.channel.game + ".", true)
                    .addField("Duration:", messageTime + " ", true)
                    .setImage(Tres.stream.preview.large)
                    .setFooter(config.name, config.avatarUrl);
                  let channel = bot.channels.cache.get(
                    e.streamMessageChannelID
                  );
                  if (channel) {
                    if (channel.guild.me.permissions.has("EMBED_LINKS")) {
                      let message = channel.messages.cache.get(
                        e.streamMessageID
                      );
                      if (message) {
                        if (
                          message.guild.me.permissions.has([
                            "MANAGE_MESSAGES",
                            "SEND_MESSAGES",
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

const getStream = (clientID, channelID) => {
  return new Promise((resolve, reject) => {
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
          reject(err);
        }
        resolve(body);
      }
    );
  });
};

module.exports = {
  events: {
    ready: ready,
  },
};
