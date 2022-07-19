const { bot } = require("../bot");
const error = require("./error");
const Guild = require("../models/guild");
const Discord = require("discord.js");

const messageCreate = async (message) => {
  if (!message) return;
  if (message.partial) await message.fetch();
  if (message.guild == null) await message.fetch();
  if (
    message.author == bot.user ||
    message.channel == "DM" ||
    message.author.bot == true
  ) {
    return;
  }

  let userConst = {
    userID: "99999999999",
    curMessCount: 1,
    lastMesss: [],
    lastMess: new Date(),
    mutes: 0,
    muteLength: 0.25,
  };

  var Gres = await Guild.findOne({
    guildID: message.guild.id,
  });

  if (!Gres) return;

  if (Gres.spamEnabled == false) {
    return;
  }

  if (Gres.spamIgnoreAdmins) {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      return;
    }
  }
  const LMessages = require(`../messages/`);

  let spam = Gres.spam.filter((v) => v.userID == message.author.id);

  if (spam.length > 0) {
    let sp = spam[0];
    if (new Date() - sp.lastMess >= Gres.spamDelay) {
      sp.curMessCount = 1;
      sp.lastMess = new Date();
      sp.lastMesss = [[message.id, message.channel.id]];
      await Guild.updateOne(
        {
          guildID: message.guild.id,
          "spam.userID": message.author.id,
        },
        {
          $set: {
            "spam.$.userID": sp.userID,
            "spam.$.curMessCount": sp.curMessCount,
            "spam.$.lastMess": sp.lastMess,
            "spam.$.mutes": sp.mutes,
            "spam.$.muteLength": sp.muteLength,
            "spam.$.lastMesss": sp.lastMesss,
          },
        }
      );
    } else {
      sp.curMessCount += 1;
      sp.lastMess = new Date();
      sp.lastMesss.push([message.id, message.channel.id]);
      if (sp.curMessCount >= 3 && sp.curMessCount < 4) {
        delMesss(sp.lastMesss);
        sp.lastMesss = [];

        if (message.guild.members.me.permissions.has("SEND_MESSAGES")) {
          message.reply(LMessages.antispam.util.stopSpaming);
        }

        await Guild.updateOne(
          {
            guildID: message.guild.id,
            "spam.userID": message.author.id,
          },
          {
            $set: {
              "spam.$.userID": sp.userID,
              "spam.$.curMessCount": sp.curMessCount,
              "spam.$.lastMess": sp.lastMess,
              "spam.$.mutes": sp.mutes,
              "spam.$.muteLength": sp.muteLength,
              "spam.$.lastMesss": sp.lastMesss,
            },
          }
        );
      } else if (sp.curMessCount >= 5) {
        sp.mutes += 1;
        delMesss(sp.lastMesss);
        sp.lastMesss = [];
        if (sp.mutes <= 3) {
          let mRole = message.guild.roles.cache.get(Gres.spamMuteRoleID);
          if (mRole) {
            if (!message.member.roles.cache.has(mRole.id)) {
              if (message.guild.members.me.permissions.has("MANAGE_ROLES")) {
                message.member.roles.add(mRole);
              }
              setTimeout(async () => {
                var Gres = await Guild.findOne({
                  guildID: message.guild.id,
                });

                let spam = Gres.spam.filter(
                  (v) => v.userID == message.author.id
                );

                if (spam.length > 0) {
                  if (spam[0].mutes == sp.mutes) {
                    if (message.member.roles.cache.has(mRole.id)) {
                      if (message.guild.members.me.permissions.has("MANAGE_ROLES")) {
                        message.member.roles.remove(mRole);
                      }
                    }
                  }
                }
              }, sp.muteLength * 3600000);
            }
          }

          await Guild.updateOne(
            {
              guildID: message.guild.id,
              "spam.userID": message.author.id,
            },
            {
              $set: {
                "spam.$.userID": sp.userID,
                "spam.$.curMessCount": sp.curMessCount,
                "spam.$.lastMess": sp.lastMess,
                "spam.$.mutes": sp.mutes,
                "spam.$.muteLength": sp.muteLength,
                "spam.$.lastMesss": sp.lastMesss,
              },
            }
          );
        } else if (sp.mutes > 3 && sp.mutes < 7) {
          sp.muteLength = 2;

          let mRole = message.guild.roles.cache.get(Gres.spamMuteRoleID);
          if (mRole) {
            if (!message.member.roles.cache.has(mRole.id)) {
              if (message.guild.members.me.permissions.has("MANAGE_ROLES")) {
                message.member.roles.add(mRole);
              }
              setTimeout(async () => {
                var Gres = await Guild.findOne({
                  guildID: message.guild.id,
                });

                let spam = Gres.spam.filter(
                  (v) => v.userID == message.author.id
                );

                if (spam.length > 0) {
                  if (spam[0].mutes == sp.mutes) {
                    if (message.member.roles.cache.has(mRole.id)) {
                      if (message.guild.members.me.permissions.has("MANAGE_ROLES")) {
                        message.member.roles.remove(mRole);
                      }
                    }
                  }
                }
              }, sp.muteLength * 3600000);
            }
          }

          await Guild.updateOne(
            {
              guildID: message.guild.id,
              "spam.userID": message.author.id,
            },
            {
              $set: {
                "spam.$.userID": sp.userID,
                "spam.$.curMessCount": sp.curMessCount,
                "spam.$.lastMess": sp.lastMess,
                "spam.$.mutes": sp.mutes,
                "spam.$.muteLength": sp.muteLength,
                "spam.$.lastMesss": sp.lastMesss,
              },
            }
          );
        } else if (sp.mutes >= 7) {
          await Guild.updateOne(
            { guildID: message.guild.id },
            { $pull: { spam: spam[0] } }
          );
          if (message.member.kickable) {
            if (message.guild.members.me.permissions.has("KICK_MEMBERS")) {
              message.member.kick("Spam.");
            }
          }
        }
      } else {
        await Guild.updateOne(
          {
            guildID: message.guild.id,
            "spam.userID": message.author.id,
          },
          {
            $set: {
              "spam.$.userID": sp.userID,
              "spam.$.curMessCount": sp.curMessCount,
              "spam.$.lastMess": sp.lastMess,
              "spam.$.mutes": sp.mutes,
              "spam.$.muteLength": sp.muteLength,
              "spam.$.lastMesss": sp.lastMesss,
            },
          }
        );
      }
    }
  } else {
    userConst.userID = message.author.id;
    await Guild.updateOne(
      { guildID: message.guild.id },
      { $push: { spam: userConst } }
    );
  }
};

function delMesss(array) {
  array.forEach(async (e) => {
    var channel = await bot.channels.fetch(e[1]);
    try {
      if (channel.guild.members.me.permissions.has("MANAGE_MESSAGES")) {
        await channel.messages.delete(e[0]);
      }
    } catch (error) {
      var err = error;
    }
  });
}

const channelCreate = async (channel) => {
  if (channel.type == Discord.ChannelType.DM) return;

  var Gres = await Guild.findOne({
    guildID: channel.guild.id,
  });

  if (Gres) {
    if (Gres.spamEnabled == false) {
      return;
    }

    let mRole = channel.guild.roles.cache.get(Gres.spamMuteRoleID);

    if (mRole) {
      if (channel.guild.members.me.permissions.has("MANAGE_ROLES")) {
        channel.createOverwrite(
          mRole,
          {
            SEND_MESSAGES: false,
            SEND_TTS_MESSAGES: false,
          },
          "Making Muted role to work here."
        );
      }
    }
  }
};

const channelUpdate = async (channel) => {
  if (channel.type == Discord.ChannelType.DM) {
    return;
  }

  var Gres = await Guild.findOne({
    guildID: channel.guild.id,
  });

  if (Gres) {
    if (Gres.spamEnabled == false) {
      return;
    }

    var mRole;
    try {
      mRole = await channel.guild.roles.fetch(Gres.spamMuteRoleID);
    } catch (error) {
      return;
    }
    if (mRole) {
      if (channel.permissionsFor(mRole)) {
        if (
          channel.permissionsFor(mRole).has("SEND_MESSAGES") &&
          channel.permissionsFor(mRole).has("SEND_TTS_MESSAGES")
        ) {
          if (channel.guild.members.me.permissions.has("MANAGE_ROLES")) {
            channel.createOverwrite(
              mRole,
              {
                SEND_MESSAGES: false,
                SEND_TTS_MESSAGES: false,
              },
              "Making Muted role to work here."
            );
          }
        }
      }
    }
  }
};

const guildMemberRemove = async (member) => {
  if (member.user == bot.user) return;
  var Gres = await Guild.findOne({
    guildID: member.guild.id,
  });
  if (!Gres) return;

  let spam = Gres.spam.filter((v) => v.userID == member.id);

  if (spam.length > 0) {
    await Guild.updateOne(
      {
        guildID: member.guild.id,
      },
      {
        $pull: { spam: spam[0] },
      }
    );
  }
};

const roleDelete = async (role) => {
  var Gres = await Guild.findOne({
    guildID: role.guild.id,
  });

  if (Gres) {
    if (Gres.spamEnabled == false) {
      return;
    }

    if ((role.id = Gres.spamMuteRoleID)) {
      await Guild.updateOne(
        {
          guildID: role.guild.id,
        },
        {
          spamEnabled: false,
          spamMuteRoleID: null,
        }
      );
    }
  }
};

const roleUpdate = async (role) => {
  var Gres = await Guild.findOne({
    guildID: role.guild.id,
  });

  if (Gres) {
    if (Gres.spamEnabled == false) {
      return;
    }
    if (role.id == Gres.spamMuteRoleID) {
      if (role.guild.members.me.permissions.has("MANAGE_ROLES")) {
        role.permissions.remove("SEND_MESSAGES", "SEND_TTS_MESSAGES");
      }
    }
  }
};

module.exports = {
  events: {
    roleUpdate: roleUpdate,
    messageCreate: messageCreate,
    channelCreate: channelCreate,
    channelUpdate: channelUpdate,
    roleDelete: roleDelete,
    guildMemberRemove: guildMemberRemove,
  },
};
