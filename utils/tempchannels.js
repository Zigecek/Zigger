const { bot } = require("../bot");
const error = require("./error");
const Guild = require("../models/guild");

const ready = () => {
  console.log(" ");
  console.log("Tempchannels - Ok.");
};

const voiceStateUpdate = async (oldMember, newMember) => {
  var Gres = await Guild.findOne({
    guildID: newMember.guild.id,
  });

  // JOIN
  let tc = Gres.tc.filter(
    (x) => x.userID == newMember.id || x.invitedUserIDs.includes(newMember.id)
  )[0];
  if (tc != null && tc != [] && tc != undefined) {
    if (
      newMember.channelID == tc.channelID &&
      oldMember.channelID != tc.channelID
    ) {
      await Guild.updateOne(
        {
          guildID: newMember.guild.id,
          "tc.channelID": tc.channelID,
        },
        {
          $set: {
            "tc.$.userID": tc.userID,
            "tc.$.channelID": tc.channelID,
            "tc.$.invitedUserIDs": tc.invitedUserIDs,
            "tc.$.joined": true,
          },
        }
      );
    }
  }

  // LEFT
  let tc2 = Gres.tc.filter(
    (x) => x.userID == oldMember.id || x.invitedUserIDs.includes(oldMember.id)
  )[0];
  if (tc2 != null && tc2 != [] && tc2 != undefined) {
    if (
      oldMember.channelID == tc2.channelID &&
      newMember.channelID != tc2.channelID
    ) {
      var chan = oldMember.guild.channels.cache.get(tc2.channelID);
      if (chan) {
        if (chan.members.size < 1) {
          if (chan.guild.me.permissions.has("MANAGE_CHANNELS")) {
            chan.delete();
          }
          await Guild.updateOne(
            { guildID: oldMember.guild.id },
            { $pull: { tc: tc2 } }
          );
        }
      } else {
        await Guild.updateOne(
          { guildID: oldMember.guild.id },
          { $pull: { tc: tc2 } }
        );
      }
    }
  }
};

const channelDelete = async (channel) => {
  var Gres = await Guild.findOne({
    guildID: channel.guild.id,
  });

  let tc = Gres.tc.filter((x) => x.channelID == channel.id)[0];

  if (tc != undefined && tc != null && tc != []) {
    await Guild.updateOne({ guildID: channel.guild.id }, { $pull: { tc: tc } });
  }
};

module.exports = {
  events: {
    channelDelete: channelDelete,
    voiceStateUpdate: voiceStateUpdate,
    ready: ready,
  },
};
