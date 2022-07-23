const Discord = require("discord.js");
var moment = require("moment");

/**
 * Adds emojis to message.
 * @param {Discord.Message} message The message to add the reactions.
 * @param {String[]} emojis Array of the emojis to add.
 */
function addReactions(message, emojis) {
  if (emojis.length != 0) {
    if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.AddReactions)) {
      message.react(emojis.shift()).then(() => {
        addReactions(message, emojis);
      });
    }
  }
}

/**
 * Shuffles array in place.
 * @param {Object[]} array - An array containing the items.
 * @returns {Object[]} - Array of shuffled song objects.
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Returns current date and time.
 * @returns {String} Date and time.
 */
function curDT() {
  var dateAndTime = `[${moment().format("DD.MM.YYYY-HH:mm:ss")}]`;
  return dateAndTime;
}

/**
 * Sends [content] into first [guild]'s channel.
 * @param {(Number|String)} content Content to send.
 * @param {Discord.Guild} guild The guild to send in.
 * @returns {Discord.Message} The sent message.
 */
function shout(content, guild) {
  return new Promise((resolve, reject) => {
    if (guild) {
      let channel = guild.channels.cache
        .filter(
          (x) =>
            x.type == Discord.ChannelType.GuildText &&
            x.permissionsFor(guild.members.me).has(Discord.PermissionFlagsBits.SendMessages) &&
            x?.nsfw == false
        )
        .first();
      if (channel) {
        if (guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
          channel
            .send(content)
            .then((message) => {
              resolve(message);
            })
            .catch((err) => {
              if (err) {
                reject(err);
              }
            });
        }
      } else {
        resolve(null);
      }
    } else {
      resolve(null);
    }
  });
}

/**
 * Deletes every message in the array.
 * @param {Array} messages Messages to delete.
 */
function deleteMessages(messages) {
  messages.forEach(async (message) => {
    if (message) {
      if (message.deletable) {
        if (message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
          await message.delete();
        }
      }
    }
  });
}

async function followReply(interaction, content) {
  content.fetchReply = true;
  try {
    const message = interaction.replied
      ? await interaction.followUp(content)
      : await interaction.reply(content);
    return message;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

function filterDuplicates(array) {
  return array.filter((x, i) => i === array.indexOf(x));
}

module.exports = {
  followReply: followReply,
  addReactions: addReactions,
  shuffle: shuffle,
  curDT: curDT,
  shout: shout,
  deleteMessages: deleteMessages,
  filterDuplicates: filterDuplicates,
};
