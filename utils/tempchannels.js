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

const { bot } = require("../bot");
const error = require("./error");
const Guild = require("../models/guild");

const ready = () => {
  console.log(" ");
  console.log("Tempchannels - Ok.");
};

const voiceStateUpdate = (params) => {
  var oldMember = params[0];
  var newMember = params[1];
  Guild.findOne(
    {
      guildID: newMember.guild.id,
    },
    (err, Gres) => {
      if (err) {
        console.error(err);
        error.sendError(err);
        return;
      }

      // JOIN
      let tc = Gres.tc.filter(
        (x) =>
          x.userID == newMember.id || x.invitedUserIDs.includes(newMember.id)
      )[0];
      if (tc != null && tc != [] && tc != undefined) {
        if (
          newMember.channelID == tc.channelID &&
          oldMember.channelID != tc.channelID
        ) {
          Guild.findOneAndUpdate(
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
            },
            function (err, res) {
              if (err) {
                console.error(err);
                error.sendError(err);
                return;
              }
            }
          );
        }
      }

      // LEFT
      let tc2 = Gres.tc.filter(
        (x) =>
          x.userID == oldMember.id || x.invitedUserIDs.includes(oldMember.id)
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
              Guild.findOneAndUpdate(
                { guildID: oldMember.guild.id },
                { $pull: { tc: tc2 } },
                (err, res) => {
                  if (err) {
                    console.error(err);
                    error.sendError(err);
                    return;
                  }
                }
              );
            }
          } else {
            Guild.findOneAndUpdate(
              { guildID: oldMember.guild.id },
              { $pull: { tc: tc2 } },
              (err, res) => {
                if (err) {
                  console.error(err);
                  error.sendError(err);
                  return;
                }
              }
            );
          }
        }
      }
    }
  );
};

const channelDelete = (params) => {
  var channel = params[0];
  Guild.findOne(
    {
      guildID: channel.guild.id,
    },
    (err, Gres) => {
      if (err) {
        console.error(err);
        error.sendError(err);
        return;
      }

      let tc = Gres.tc.filter((x) => x.channelID == channel.id)[0];

      if (tc != undefined && tc != null && tc != []) {
        Guild.findOneAndUpdate(
          { guildID: channel.guild.id },
          { $pull: { tc: tc } },
          (err, res) => {
            if (err) {
              console.error(err);
              error.sendError(err);
              return;
            }
          }
        );
      }
    }
  );
};

module.exports = {
  events: {
    channelDelete: channelDelete,
    voiceStateUpdate: voiceStateUpdate,
    ready: ready,
  },
};
