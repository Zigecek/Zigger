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
var moment = require("moment");

/**
 * Adds emojis to message.
 * @param {Discord.Message} message The message to add the reactions.
 * @param {String[]} emojis Array of the emojis to add.
 */
function addReactions(message, emojis) {
  if (emojis.length != 0) {
    if (message.guild.me.permissions.has("ADD_REACTIONS")) {
      message.react(emojis.shift()).then(() => {
        addReactions(message, emojis);
      });
    }
  }
}
/**
 * Adds commas after every 3 numbers.
 * @param {(Number|String)} number The number to commafy.
 * @returns {String} Commafied number.
 */
function commafy(number) {
  var str = number.toString().split(".");
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, "$1 ");
  }
  return str.join(".");
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
            x.type == "GUILD_TEXT" &&
            x.permissionsFor(guild.me).has("SEND_MESSAGES") &&
            x?.nsfw == false
        )
        .first();
      if (channel) {
        if (guild.me.permissions.has("SEND_MESSAGES")) {
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
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) {
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
  commafy: commafy,
  curDT: curDT,
  shout: shout,
  deleteMessages: deleteMessages,
  filterDuplicates: filterDuplicates,
};
