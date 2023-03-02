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
    name: "version",
    description: "Sends the version information of the process.",
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
