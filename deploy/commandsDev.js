module.exports = {
  dev: {
    name: "dev",
    description: "Dev.",
    options: [
      {
        name: "guild",
        description: "Dev.",
        type: 2,
        options: [
          {
            name: "admin",
            description: "Dev.",
            type: 1,
            options: [
              {
                name: "id",
                description: "Dev.",
                type: "STRING",
                required: true,
              },
            ],
          },
          {
            name: "unban",
            description: "Dev.",
            type: 1,
            options: [
              {
                name: "id",
                description: "Dev.",
                type: "STRING",
                required: true,
              },
            ],
          },
          {
            name: "dc",
            description: "Dev.",
            type: 1,
            options: [
              {
                name: "id",
                description: "Dev.",
                type: "STRING",
                required: true,
              },
            ],
          },
          {
            name: "plus",
            description: "Dev.",
            type: 1,
            options: [
              {
                name: "id",
                description: "Dev.",
                type: "STRING",
                required: true,
              },
            ],
          },
          {
            name: "info",
            description: "Dev.",
            type: 1,
            options: [
              {
                name: "id",
                description: "Dev.",
                type: "STRING",
                required: true,
              },
            ],
          },
        ],
      },
      {
        name: "rpi",
        description: "Dev.",
        type: 2,
        options: [
          {
            name: "logs",
            description: "Dev.",
            type: 1,
          },
          {
            name: "eval",
            description: "Dev.",
            type: 1,
            options: [
              {
                name: "command",
                description: "Dev.",
                type: "STRING",
                required: true,
              },
            ],
          },
          {
            name: "restart",
            description: "Dev.",
            type: 1,
          },
          {
            name: "flush",
            description: "Dev.",
            type: 1,
          },
          {
            name: "ssh",
            description: "Dev.",
            type: 1,
          },
        ],
      },
      {
        name: "global",
        description: "Dev.",
        type: 2,
        options: [
          {
            name: "playing",
            description: "Dev.",
            type: 1,
          },
          {
            name: "guilds",
            description: "Dev.",
            type: 1,
          },
          {
            name: "update",
            description: "Dev.",
            type: 1,
          },
          {
            name: "deploy",
            description: "Dev.",
            type: 1,
          },
          {
            name: "shout",
            description: "Dev.",
            type: 1,
            options: [
              {
                name: "message",
                type: "STRING",
                required: true,
                description: "Dev.",
              },
            ],
          },
          {
            name: "eval",
            description: "Evalutes code.",
            type: 1,
            options: [
              {
                name: "code",
                description: "Code to evalute.",
                type: "STRING",
                required: true,
              },
            ],
          },
        ],
      },
    ],
  },
};
