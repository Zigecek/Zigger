const Types = {
  SUB_COMMAND: 1,
  SUB_COMMAND_GROUP: 2,
  STRING: 3,
  INTEGER: 4,
  BOOLEAN: 5,
  USER: 6,
  CHANNEL: 7,
  ROLE: 8,
  MENTIONABLE: 9,
  NUMBER: 10,
};

module.exports = [
  {
    name: "play",
    description: "Plays a song.",
    options: [
      {
        name: "song",
        type: Types.STRING,
        description: "URL or song name.",
        required: true,
      },
    ],
  },
  {
    name: "stop",
    description: "Stops playing songs.",
  },
  {
    name: "skip",
    description: "Skips current song.",
    options: [
      {
        name: "count",
        type: Types.NUMBER,
        description: "Count of skipped songs.",
        required: false,
      },
    ],
  },
  {
    name: "search",
    description: "Searches and plays a song.",
    options: [
      {
        name: "query",
        type: Types.STRING,
        description: "Search query.",
        required: true,
      },
    ],
  },
  {
    name: "nowplaying",
    description: "Shows playing song.",
  },
  {
    name: "volume",
    description: "Sets bot's volume.",
    options: [
      {
        name: "volume",
        type: Types.NUMBER,
        description: "Volume to set.",
        required: false,
      },
    ],
  },
  {
    name: "queue",
    description: "List the queue.",
    options: [
      {
        name: "page",
        type: Types.NUMBER,
        description: "Number of the page.",
        required: false,
      },
    ],
  },
  {
    name: "join",
    description: "Joins your channel",
  },
  {
    name: "leave",
    description: "Leaves current channel.",
  },
  {
    name: "pause",
    description: "Pauses current song.",
  },
  {
    name: "resume",
    description: "Unpauses current song.",
  },
  {
    name: "loop",
    description: "Loops current song.",
  },
  {
    name: "shuffle",
    description: "Shuffles the queue.",
  },
  {
    name: "remove",
    description: "Removes song from the queue.",
    options: [
      {
        name: "index",
        type: Types.NUMBER,
        description: "Index of the song.",
        required: true,
      },
    ],
  },
  {
    name: "clearqueue",
    description: "Clears all songs in the queue.",
  },
  {
    name: "loopqueue",
    description: "Loops the queue.",
  },
  {
    name: "reactionroles",
    description: "Manages the reaction roles.",
    options: [
      {
        name: "create",
        description: "Creates the reaction role message.",
        type: Types.SUB_COMMAND,
        options: [
          {
            name: "content",
            description: "Content of the message.",
            type: Types.STRING,
            required: true,
          },
          {
            name: "channel",
            description: "Channel where to send the message.",
            type: Types.CHANNEL,
            required: true,
          },
          {
            name: "role1",
            description: "Mention of the first role.",
            type: Types.ROLE,
            required: true,
          },
          {
            name: "emoji1",
            description: "Emoji for the first role.",
            type: Types.STRING,
            required: true,
          },
          {
            name: "role2",
            description: "Mention of the second role.",
            type: Types.ROLE,
            required: false,
          },
          {
            name: "emoji2",
            description: "Emoji for the second role.",
            type: Types.STRING,
            required: false,
          },
          {
            name: "role3",
            description: "Mention of the third role.",
            type: Types.ROLE,
            required: false,
          },
          {
            name: "emoji3",
            description: "Emoji for the third role.",
            type: Types.STRING,
            required: false,
          },
          {
            name: "role4",
            description: "Mention of the fourth role.",
            type: Types.ROLE,
            required: false,
          },
          {
            name: "emoji4",
            description: "Emoji for the fourth role.",
            type: Types.STRING,
            required: false,
          },
          {
            name: "role5",
            description: "Mention of the fifth role.",
            type: Types.ROLE,
            required: false,
          },
          {
            name: "emoji5",
            description: "Emoji for the fifth role.",
            type: Types.STRING,
            required: false,
          },
          {
            name: "role6",
            description: "Mention of the sixth role.",
            type: Types.ROLE,
            required: false,
          },
          {
            name: "emoji6",
            description: "Emoji for the sixth role.",
            type: Types.STRING,
            required: false,
          },
          {
            name: "role7",
            description: "Mention of the seventh role.",
            type: Types.ROLE,
            required: false,
          },
          {
            name: "emoji7",
            description: "Emoji for the seventh role.",
            type: Types.STRING,
            required: false,
          },
          {
            name: "role8",
            description: "Mention of the eighth role.",
            type: Types.ROLE,
            required: false,
          },
          {
            name: "emoji8",
            description: "Emoji for the eighth role.",
            type: Types.STRING,
            required: false,
          },
          {
            name: "role9",
            description: "Mention of the ninth role.",
            type: Types.ROLE,
            required: false,
          },
          {
            name: "emoji9",
            description: "Emoji for the ninth role.",
            type: Types.STRING,
            required: false,
          },
        ],
      },
    ],
  },
  {
    name: "version",
    description: "Sends the version information of the process.",
  },
  {
    name: "counters",
    description: "Manages the server statistics.",
    options: [
      {
        name: "create",
        type: Types.SUB_COMMAND,
        description: "Creates the new stat.",
        options: [
          {
            name: "type",
            required: true,
            description: "Type of the statistic.",
            type: Types.STRING,
            choices: [
              {
                name: "All",
                value: "all",
              },
              {
                name: "Members",
                value: "members",
              },
              {
                name: "Bots",
                value: "bots",
              },
              {
                name: "Online members",
                value: "online",
              },
              {
                name: "Offline members",
                value: "offline",
              },
              {
                name: "Idle members",
                value: "idle",
              },
              {
                name: "Do Not Disturb members",
                value: "dnd",
              },
              {
                name: "Not Offline members",
                value: "notOffline",
              },
              {
                name: "Roles",
                value: "roles",
              },
              {
                name: "Channels",
                value: "channels",
              },
              {
                name: "Text channels",
                value: "text",
              },
              {
                name: "Voice Channels",
                value: "voice",
              },
              {
                name: "Categories",
                value: "catergories",
              },
              {
                name: "Announcement channels",
                value: "announcement",
              },
              {
                name: "Stages",
                value: "stages",
              },
              {
                name: "Emojis",
                value: "emojis",
              },
              {
                name: "Boosters",
                value: "boosters",
              },
              {
                name: "Server nitro tier",
                value: "tier",
              },
            ],
          },
        ],
      },
      {
        name: "setup",
        description: "Creates the category with some example stats.",
        type: Types.SUB_COMMAND,
      },
      {
        name: "customize",
        description: "Gives the information about customaziting the stats.",
        type: Types.SUB_COMMAND,
      },
      {
        name: "reset",
        description: "Removes the category with all the stats",
        type: Types.SUB_COMMAND,
      },
    ],
  },
  {
    name: "autorole",
    description: "Manages the autoroles.",
    options: [
      {
        name: "add",
        description: "Adds the role to autorole list.",
        type: Types.SUB_COMMAND,
        options: [
          {
            name: "role1",
            type: Types.ROLE,
            required: true,
            description: "First role mention.",
          },
          {
            name: "role2",
            type: Types.ROLE,
            required: false,
            description: "Second role mention.",
          },
          {
            name: "role3",
            type: Types.ROLE,
            required: false,
            description: "Third role mention.",
          },
          {
            name: "role4",
            type: Types.ROLE,
            required: false,
            description: "Fourth role mention.",
          },
          {
            name: "role5",
            type: Types.ROLE,
            required: false,
            description: "Fifth role mention.",
          },
          {
            name: "role6",
            type: Types.ROLE,
            required: false,
            description: "Sixth role mention.",
          },
          {
            name: "role7",
            type: Types.ROLE,
            required: false,
            description: "Seventh role mention.",
          },
          {
            name: "role8",
            type: Types.ROLE,
            required: false,
            description: "eighth role mention.",
          },
          {
            name: "role9",
            type: Types.ROLE,
            required: false,
            description: "Ninth role mention.",
          },
        ],
      },
      {
        name: "remove",
        description: "Removes the role from autorole list.",
        type: Types.SUB_COMMAND,
        options: [
          {
            name: "role1",
            type: Types.ROLE,
            required: true,
            description: "First role mention.",
          },
          {
            name: "role2",
            type: Types.ROLE,
            required: false,
            description: "Second role mention.",
          },
          {
            name: "role3",
            type: Types.ROLE,
            required: false,
            description: "Third role mention.",
          },
          {
            name: "role4",
            type: Types.ROLE,
            required: false,
            description: "Fourth role mention.",
          },
          {
            name: "role5",
            type: Types.ROLE,
            required: false,
            description: "Fifth role mention.",
          },
          {
            name: "role6",
            type: Types.ROLE,
            required: false,
            description: "Sixth role mention.",
          },
          {
            name: "role7",
            type: Types.ROLE,
            required: false,
            description: "Seventh role mention.",
          },
          {
            name: "role8",
            type: Types.ROLE,
            required: false,
            description: "eighth role mention.",
          },
          {
            name: "role9",
            type: Types.ROLE,
            required: false,
            description: "Ninth role mention.",
          },
        ],
      },
      {
        name: "info",
        description: "Shows all added roles.",
        type: Types.SUB_COMMAND,
      },
      {
        name: "on",
        description: "Turns on role adding.",
        type: Types.SUB_COMMAND,
      },
      {
        name: "off",
        description: "Turns off role adding.",
        type: Types.SUB_COMMAND,
      },
    ],
  },
  {
    name: "clear",
    description: "Clears messages in text channel.",
    options: [
      {
        name: "amount",
        description: "Amount of the messages that will be deleted.",
        type: Types.STRING,
        required: true,
      },
    ],
  },
  {
    name: "calladmin",
    description: "Sends link to this message to see the problem.",
  },
  {
    name: "howgay",
    description: "Sends random percents.",
    options: [
      {
        name: "anything",
        required: false,
        type: Types.STRING,
        description: "You can use mention of someone too.",
      },
    ],
  },
  {
    name: "penis",
    description: "Sends random length.",
    options: [
      {
        name: "anything",
        required: false,
        type: Types.STRING,
        description: "You can use mention too.",
      },
    ],
  },
  {
    name: "channel",
    description: "Manages welcome and bye channels.",
    options: [
      {
        name: "welcome",
        description: "Manages welcome channel.",
        type: Types.SUB_COMMAND_GROUP,
        options: [
          {
            name: "set",
            description: "Sets the welcome channel.",
            type: Types.SUB_COMMAND,
            options: [
              {
                name: "channel",
                description: "Mention of the channel.",
                type: Types.CHANNEL,
                required: true,
              },
            ],
          },
          {
            name: "info",
            description: "Shows current welcome channel.",
            type: Types.SUB_COMMAND,
          },
        ],
      },
      {
        name: "bye",
        description: "Manages bye channel.",
        type: Types.SUB_COMMAND_GROUP,
        options: [
          {
            name: "set",
            description: "Sets the bye channel.",
            type: Types.SUB_COMMAND,
            options: [
              {
                name: "channel",
                description: "Mention of the channel.",
                type: Types.CHANNEL,
                required: true,
              },
            ],
          },
          {
            name: "info",
            description: "Shows current bye channel.",
            type: Types.SUB_COMMAND,
          },
        ],
      },
    ],
  },
  {
    name: "antispam",
    description: "Manages the antispam function.",
    options: [
      {
        name: "info",
        description: "Shows current setting and info.",
        type: Types.SUB_COMMAND,
      },
      {
        name: "enable",
        description: "Enables the function.",
        type: Types.SUB_COMMAND,
      },
      {
        name: "disable",
        description: "Disables the function.",
        type: Types.SUB_COMMAND,
      },
      {
        name: "reset",
        description: "Resets spam stats for a member/s.",
        type: Types.SUB_COMMAND,
        options: [
          {
            name: "member1",
            type: Types.USER,
            description: "First member to reset their stats.",
            required: true,
          },
          {
            name: "member2",
            type: Types.USER,
            description: "Second member to reset their stats.",
            required: false,
          },
          {
            name: "member3",
            type: Types.USER,
            description: "Third member to reset their stats.",
            required: false,
          },
          {
            name: "member4",
            type: Types.USER,
            description: "Fourth member to reset their stats.",
            required: false,
          },
          {
            name: "member5",
            type: Types.USER,
            description: "Fifth member to reset their stats.",
            required: false,
          },
          {
            name: "member6",
            type: Types.USER,
            description: "Sixth member to reset their stats.",
            required: false,
          },
          {
            name: "member7",
            type: Types.USER,
            description: "Seventh member to reset their stats.",
            required: false,
          },
          {
            name: "member8",
            type: Types.USER,
            description: "Eighth member to reset their stats.",
            required: false,
          },
          {
            name: "member9",
            type: Types.USER,
            description: "Ninth member to reset their stats.",
            required: false,
          },
        ],
      },
      {
        name: "delay",
        description: "Sets the delay.",
        type: Types.SUB_COMMAND,
        options: [
          {
            name: "delay",
            type: Types.NUMBER,
            description: "Delay between message to take as spam.",
            required: false,
          },
        ],
      },
      {
        name: "ignoreadmins",
        description:
          'If set to "Ignore" the bot won\'t try to ban or somehow punish admins.',
        type: Types.SUB_COMMAND,
        options: [
          {
            name: "option",
            type: Types.INTEGER,
            description: "Option to set.",
            choices: [
              {
                name: "Ignore",
                value: 1,
              },
              {
                name: "Don't ignore",
                value: 0,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "invite",
    description: "Creates an invite to the server or to your voice channel.",
  },
  {
    name: "meme",
    description: "Sends random meme.",
  },
  {
    name: "ping",
    description: "Shows bot's and API's ping.",
  },
  {
    name: "settings",
    description: "Manages bot's server settings.",
    options: [
      {
        name: "defaultvolume",
        description: "Sets bot's default volume.",
        type: Types.SUB_COMMAND_GROUP,
        options: [
          {
            name: "info",
            description: "Shows the default volume.",
            type: Types.SUB_COMMAND,
          },
          {
            name: "set",
            description: "Sets the default volume.",
            type: Types.SUB_COMMAND,
            options: [
              {
                name: "volume",
                type: Types.NUMBER,
                required: false,
                description: "Volume to set.",
              },
            ],
          },
        ],
      },
      {
        name: "blacklist",
        description: "Blacklist's a channel/s from using music commands.",
        type: Types.SUB_COMMAND_GROUP,
        options: [
          {
            name: "info",
            description: "Shows all blacklisted channels.",
            type: Types.SUB_COMMAND,
          },
          {
            name: "add",
            description: "Adds channel to the blacklist.",
            type: Types.SUB_COMMAND,
            options: [
              {
                name: "channel1",
                type: Types.CHANNEL,
                required: false,
                description: "First channel mention.",
              },
              {
                name: "channel2",
                type: Types.CHANNEL,
                required: false,
                description: "Second channel mention.",
              },
              {
                name: "channel3",
                type: Types.CHANNEL,
                required: false,
                description: "Third channel mention.",
              },
              {
                name: "channel4",
                type: Types.CHANNEL,
                required: false,
                description: "Fourth channel mention.",
              },
              {
                name: "channel5",
                type: Types.CHANNEL,
                required: false,
                description: "Fifth channel mention.",
              },
              {
                name: "channel6",
                type: Types.CHANNEL,
                required: false,
                description: "Sixth channel mention.",
              },
              {
                name: "channel7",
                type: Types.CHANNEL,
                required: false,
                description: "Seventh channel mention.",
              },
              {
                name: "channel8",
                type: Types.CHANNEL,
                required: false,
                description: "Eighth channel mention.",
              },
              {
                name: "channel9",
                type: Types.CHANNEL,
                required: false,
                description: "Ninth channel mention.",
              },
            ],
          },
          {
            name: "remove",
            description: "Removes channel from the blacklist.",
            type: Types.SUB_COMMAND,
            options: [
              {
                name: "channel1",
                type: Types.CHANNEL,
                required: false,
                description: "First channel mention.",
              },
              {
                name: "channel2",
                type: Types.CHANNEL,
                required: false,
                description: "Second channel mention.",
              },
              {
                name: "channel3",
                type: Types.CHANNEL,
                required: false,
                description: "Third channel mention.",
              },
              {
                name: "channel4",
                type: Types.CHANNEL,
                required: false,
                description: "Fourth channel mention.",
              },
              {
                name: "channel5",
                type: Types.CHANNEL,
                required: false,
                description: "Fifth channel mention.",
              },
              {
                name: "channel6",
                type: Types.CHANNEL,
                required: false,
                description: "Sixth channel mention.",
              },
              {
                name: "channel7",
                type: Types.CHANNEL,
                required: false,
                description: "Seventh channel mention.",
              },
              {
                name: "channel8",
                type: Types.CHANNEL,
                required: false,
                description: "Eighth channel mention.",
              },
              {
                name: "channel9",
                type: Types.CHANNEL,
                required: false,
                description: "Ninth channel mention.",
              },
            ],
          },
        ],
      },
      {
        name: "announce",
        description: "Manages song announcement.",
        type: Types.SUB_COMMAND_GROUP,
        options: [
          {
            name: "set",
            description: "Changes the mode of announcement.",
            type: Types.SUB_COMMAND,
            options: [
              {
                name: "mode",
                description: "Mode of the announcement.",
                type: Types.INTEGER,
                choices: [
                  {
                    name: "Short",
                    value: 3,
                  },
                  {
                    name: "Full",
                    value: 1,
                  },
                  {
                    name: "Off",
                    value: 0,
                  },
                ],
              },
            ],
          },
          {
            name: "info",
            description: "Shows the announcement mode",
            type: Types.SUB_COMMAND,
          },
        ],
      },
    ],
  },
  {
    name: "twitch",
    description: "Manages twitch notifications.",
    options: [
      {
        name: "user",
        type: Types.SUB_COMMAND_GROUP,
        description:
          "Manages the twitch user (channel) to get the informations from.",
        options: [
          {
            name: "info",
            description: "Shows current twitch user (channel).",
            type: Types.SUB_COMMAND,
          },
          {
            name: "set",
            description: "Sets the twitch user (channel).",
            type: Types.SUB_COMMAND,
            options: [
              {
                name: "user",
                description: "The twitch user to set.",
                type: Types.STRING,
                required: true,
              },
            ],
          },
        ],
      },
      {
        name: "notifychannel",
        type: Types.SUB_COMMAND_GROUP,
        description: "Manages the notify channel.",
        options: [
          {
            name: "info",
            description: "Shows current notify channel.",
            type: Types.SUB_COMMAND,
          },
          {
            name: "set",
            description: "Sets the twitch user (channel).",
            type: Types.SUB_COMMAND,
            options: [
              {
                name: "channel",
                description: "The twitch user to set.",
                type: Types.CHANNEL,
                required: true,
              },
            ],
          },
        ],
      },
      {
        name: "notify",
        type: Types.SUB_COMMAND_GROUP,
        description: "Manages the notifications.",
        options: [
          {
            name: "enable",
            description: "Enabled the notifications.",
            type: Types.SUB_COMMAND,
          },
          {
            name: "disable",
            description: "Disables the notifications.",
            type: Types.SUB_COMMAND,
          },
        ],
      },
    ],
  },
  {
    name: "tempchannel",
    description: "Manages the tempchannels.",
    options: [
      {
        name: "create",
        description: "Creates new tempchannel for you.",
        type: Types.SUB_COMMAND,
      },
      {
        name: "add",
        description: "Allows the member/s to see and join your tempchannel.",
        type: Types.SUB_COMMAND,
        options: [
          {
            name: "member1",
            type: Types.USER,
            description: "First member to add.",
            required: true,
          },
          {
            name: "member2",
            type: Types.USER,
            description: "Second member to add.",
            required: false,
          },
          {
            name: "member3",
            type: Types.USER,
            description: "Third member to add.",
            required: false,
          },
          {
            name: "member4",
            type: Types.USER,
            description: "Fourth member to add.",
            required: false,
          },
          {
            name: "member5",
            type: Types.USER,
            description: "Fifth member to add.",
            required: false,
          },
          {
            name: "member6",
            type: Types.USER,
            description: "Sixth member to add.",
            required: false,
          },
          {
            name: "member7",
            type: Types.USER,
            description: "Seventh member to add.",
            required: false,
          },
          {
            name: "member8",
            type: Types.USER,
            description: "Eighth member to add.",
            required: false,
          },
          {
            name: "member9",
            type: Types.USER,
            description: "Ninth member to add.",
            required: false,
          },
        ],
      },
      {
        name: "remove",
        description: "Disables the member/s to see and join your tempchannel.",
        type: Types.SUB_COMMAND,
        options: [
          {
            name: "member1",
            type: Types.USER,
            description: "First member to remove.",
            required: true,
          },
          {
            name: "member2",
            type: Types.USER,
            description: "Second member to remove.",
            required: false,
          },
          {
            name: "member3",
            type: Types.USER,
            description: "Third member to remove.",
            required: false,
          },
          {
            name: "member4",
            type: Types.USER,
            description: "Fourth member to remove.",
            required: false,
          },
          {
            name: "member5",
            type: Types.USER,
            description: "Fifth member to remove.",
            required: false,
          },
          {
            name: "member6",
            type: Types.USER,
            description: "Sixth member to remove.",
            required: false,
          },
          {
            name: "member7",
            type: Types.USER,
            description: "Seventh member to remove.",
            required: false,
          },
          {
            name: "member8",
            type: Types.USER,
            description: "Eighth member to remove.",
            required: false,
          },
          {
            name: "member9",
            type: Types.USER,
            description: "Ninth member to remove.",
            required: false,
          },
        ],
      },
    ],
  },
  {
    name: "urban",
    description: "Searches the query on Urban Dictionary.",
    options: [
      {
        name: "query",
        description: "The query to search.",
        type: Types.STRING,
        required: true,
      },
    ],
  },
  /******************** TEMP */
  {
    name: "prefix",
    description: "Manages bot's prefix.",
    options: [
      {
        name: "set",
        description: "Changes the prefix.",
        type: Types.SUB_COMMAND,
        options: [
          {
            name: "prefix",
            description: "New prefix to set.",
            type: Types.STRING,
            required: true,
          },
        ],
      },
      {
        name: "info",
        description: "Shows current prefix.",
        type: Types.SUB_COMMAND,
      },
    ],
  },
  /******************** TEMP */
];
