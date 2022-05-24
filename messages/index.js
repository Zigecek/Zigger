
module.exports = {
  /// KATEGORIE ///
  /**
   * music
   * fun
   * moderation
   * settings
   * twitch
   * reactionroles
   * counters
   * tempchannel
   * other
   */

  /// GLOBAL ///
  noPermission: "**<:tickNo:870239550163779604> You don't have permissions.**",
  pingingMessage: "**Pinging...**",
  pingMessage: "**Bot latency:** `%delay%ms` **API latency:** `%apiDelay%ms`", // %delay% for message delay, %apiDelay% for api latency
  joinMessage: "%member% has joined!", // %member% for member mention
  leaveMessage: "**%member%** has left!", // %member% for memeber mention
  cooldownMess:
    "**<:tickNo:870239550163779604> Not too fast, wait `%secs%`s.**", // %secs% fow secs till cooldown come out
  invalidCommand: "**<:tickNo:870239550163779604> Invalid command.**",
  newInvite: "**Here is your invite:** %url%", // %url% for url mention of new invite
  mention: "**:wave: My prefix is `%prefix%`**", // %prefx% for the prefix
  botJoinsGuild:
    "**:wave: Hi, I'm Zigger, my prefix is `%prefix%` and you can start with `%prefix%help`**", // %prefix% to get the current prefix
  error:
    "**<:tickNo:870239550163779604> Error occured, contact admin using this command:** `calladmin`",
  rejoinRecommended:
    "*For the best performance of the bot I recommend to kick the bot out of the server and again invite him back using official link here: *https://zigecek.github.io/zigger*.*",
  botNoPermission:
    "**<:tickNo:870239550163779604> I have not permissions to do this.**",

  adminNotified: "**<:tickYes:870238031603462154> Admin has been called.**",

  nsfwBlocked: "**<:tickNo:870239550163779604> NSFW isn't allowed !!!**",

  /// CHANNELS ///
  channels: {
    notFoundOrNoMention:
      "**<:tickNo:870239550163779604> Channel not found, use `#` to mention.**",

    // - WEL
    wel: {
      notSet: "**:thumbsdown: Welcome channel isn't set.**",
      whatIs: "**:label: Welcome channel is:** %log%", // %log% for channel mention
      set: "**<:tickYes:870238031603462154> Welcome channel has been set to:** %log%", // %log% for channel mention
      use: "**:scroll: Use:** \n```\n%prefix%channel wel set <#kanál>\n```",
    },

    // - BYE
    bye: {
      notSet: "**:thumbsdown: Bye channel isn't set.**",
      whatIs: "**:label: Bye channel is:** %bye%", // %bye% for channel mention
      set: "**<:tickYes:870238031603462154> Bye channel has been set to:** %bye%", // %bye% for channel mention
      use: "**:scroll: Use:** \n```\n%prefix%channel bye set <#kanál>\n```",
    },
  },

  /// FUN ///
  fun: {
    // - HOWGAY
    howGay: {
      anything: "%thing% is **%percent%%** gay!", // %thing% for thing mention, %percent% for percent value
      member: "%member% is **%percent%%** gay!", //%precent% for percent value, %member% for member mention
      author: "%mention%, you are **%percent%%** gay!", // %percent% for percent value
    },

    // - PENIS
    penis: {
      anything: "%thing% has **%lenght%cm** long dick!", // %thing% for thing mention, %lenght% for lenght of penis
      member: "%member% has **%lenght%cm** long dick!", // %lenght% for lenght of penis, %member% for member mention
      author: "%mention%, you have **%lenght%cm** long dick!", // %lenght% for lenght of penis
    },
  },

  /// PREFIX ///
  prefix: {
    info: "**Current prefix for this guild is: `%prefix%`**", // %guild% for guild name, %prefix% for prefix
    use: "**Use: `prefix set <prefix>`**",
    set: "**<:tickYes:870238031603462154> Prefix for guild `%guild%` has been set to** `%prefix%`", // %guild% for guild name, %prefix% for prefix
  },

  /// TWITCH ///
  twitch: {
    userNotSet: "**:warning: Twitch user isn't set up.**",
    userSet:
      "**<:tickYes:870238031603462154> Twitch user has been set to:** `%user%`", // %user% for user
    userNotFound: "**<:tickNo:870239550163779604> Twitch user not found.**",
    userUse: "**Usage:** `twitch user set <twitch jméno>`",

    channelNotSet: "**:warning: Twitch notify channel isn't set up.**",
    channelInfo:
      "**<:tickYes:870238031603462154> Twitch notify channel is:** %channel%", // %channel% for channel mention
    channelSet:
      "**<:tickYes:870238031603462154> Twitch notify channel has been set to:** %channel%", // %channel% for channel mention
    channelUse: "**Use:** `twitch notifychannel set <#channel>`",

    turnOn: "**<:tickYes:870238031603462154> Notification on.**",
    isAlreadyOn:
      "**<:tickYes:870238031603462154> Notification is already on.**",

    turnOff: "**<:tickYes:870238031603462154> Notification off.**",
    isAlreadyOff:
      "**<:tickYes:870238031603462154> Notification is already off.**",

    userProbablyDeletedAcc:
      "**<:tickNo:870239550163779604> User has probably deleted his account.**",
  },

  /// HELP ///
  help: {
    noPermission:
      "**<:tickNo:870239550163779604> I don't have permission to link embeds.**",
    list: "List of all commands.",
    footer: 'You can use "help <command>".',
    commandDoesntExist:
      "**<:tickNo:870239550163779604> This command doesn't exist.**",

    categories: {
      twitch: {
        label: "Twitch",
        commands:
          "```\n• twitch on/off\n• twitch user\n• twitch user set [twitch user]\n• twitch notifychannel\n• twitch notifychannel set [#channel]\n```",
      },

      other: {
        label: "Other",
        commands: "```\n• ping\n• clear [quantity]\n• invite\n• calladmin\n```",
      },

      music: {
        label: "Music",
        commands:
          "```\n• play [query/url]\n• search [query]\n• stop\n• volume\n• volume [volume]\n• queue\n• queue [page]\n• skip\n• forceskip\n• nowplaying\n• pause\n• resume\n• loop\n• queueloop\n• shuffle\n• join\n• leave\n• clearqueue\n• remove [index]\n• defaultvolume\n• defaultvolume [volume]\n```",
      },

      fun: {
        label: "Fun",
        commands: "```\n• penis \n• howgay\n• meme\n• urban\n```",
      },

      settings: {
        label: "Settings",
        commands:
          "```\n• prefix\n• prefix set\n• settings annouce\n• settings annouce on/off/short\n• settings defaultvolume\n• settings defaultvolume [volume]\n• settings blacklist [#channel]\n```",
      },

      counters: {
        label: "Counters",
        commands:
          "```\n• counters setup\n• counters create\n• counters customize\n• counters reset\n```",
      },

      reactionroles: {
        label: "ReactionRoles",
        commands: "```\n• reactionroles create\n```",
      },

      tempchannel: {
        label: "Temp Channels",
        commands:
          "```\n• tempchannel create\n• tempchannel add\n• tempchannel remove \n```",
      },

      moderation: {
        label: "Moderation",
        commands:
          "```\n• autorole\n• autorole add [@role]\n• autorole on/off\n• channel wel/bye\n• channel wel/bye set [#channel]\n• antispam\n• antispam enable\n• antispam disable\n• antispam reset [@member]\n• antispam delay\n• antispam delay [miliseconds]\n• antispam ignoreadmins\n• antispam ignoreadmins true/false\n```",
      },
    },

    helpCommands: {
      messages: {
        help: "Help for command '%command%'", // %command% for command name
      },
      labels: {
        aliases: "Aliases",
        permissions: "Needed permissions",
        usage: "Use",
        params: "Parameters",
        description: "Description",
        required: "Required",
        exception: "Exception when",
        category: "Category",
      },
      play: {
        aliases: "```\np [query]\n```",
        permissions: "",
        usage: "```\nplay [query]\n```",
        params:
          "```\n[query] - query or valid URL of YouTube video / playlist.\n```",
        description:
          "If not, the bot connects to the sender's voice channel. -> Searches and plays a song by expression or URL.",
        required: "```\nBe in any voice channel.\n```",
        exception: "",
        category: "```\nmusic\n```",
      },
      p: {
        aliases: "```\nplay [query]\n```",
        permissions: "",
        usage: "```\np [query]\n```",
        params:
          "```\n[query] - query or valid URL of YouTube video / playlist.\n```",
        description:
          "If not, the bot connects to the sender's voice channel. -> Searches and plays a song by expression or URL.",
        required: "```\nBe in any voice channel.\n```",
        exception: "",
        category: "```\nmusic\n```",
      },
      stop: {
        aliases: "",
        permissions: "",
        usage: "```\nstop\n```",
        params: "",
        description:
          "If it's playing song (even when paused), it stops playing and clears the queue.",
        required: "```\nBe in any voice channel with the bot.\n```",
        exception: "",
        category: "```\nmusic\n```",
      },
      skip: {
        aliases: "",
        permissions: "",
        usage: "```\nskip\n```",
        params: "",
        description:
          "If it's playing, it starts a vote to skip the song, 75% of the people in the voice channel need vote to skip the song.",
        required: "```\nBe in any voice channel with the bot.\n```",
        exception: "",
        category: "```\nmusic\n```",
      },
      fs: {
        aliases: "```\nforceskip\n```",
        permissions:
          "```\nMANAGE_CHANNELS\nADMINISTRATOR\nor lowest role in the server.\n```",
        usage: "```\nfs\n```",
        params: "",
        description: "If it's playing, instantly skips the song.",
        required: "```\nBe in any voice channel with the bot.\n```",
        exception: "```\nIf the sender is in the voice channel alone.\n```",
        category: "```\nmusic\n```",
      },
      search: {
        aliases: "",
        permissions: "",
        usage: "```\nsearch [query]\n```",
        params: "```\n[query] - Query to search.\n```",
        description:
          "If not, the bot connects to the sender's voice channel. -> Searches and plays a song by [query].",
        required: "```\nBe in any voice channel.\n```",
        exception: "",
        category: "```\nmusic\n```",
      },
      forceskip: {
        aliases: "```\nfs\n```",
        permissions:
          "```\nMANAGE_CHANNELS\nor ADMINISTRATOR\nor lowest role in the server.\n```",
        usage: "```\nfs\n```",
        params: "",
        description: "If it's playing, instantly skips the song.",
        required: "```\nBe in any voice channel with the bot.\n```",
        exception: "```\nIf the sender is in the voice channel alone.\n```",
        category: "```\nmusic\n```",
      },
      nowplaying: {
        aliases: "```\nnp, playing\n```",
        permissions: "",
        usage: "```\nnowplaying\n```",
        params: "",
        description: "If it's playing, shows song that is now playing.",
        required: "",
        exception: "",
        category: "```\nmusic\n```",
      },
      np: {
        aliases: "```\nplaying, nowplaying\n```",
        permissions: "",
        usage: "```\nnp\n```",
        params: "",
        description: "If it's playing, shows song that is now playing.",
        required: "",
        exception: "",
        category: "```\nmusic\n```",
      },
      playing: {
        aliases: "```\nnowplaying, np\n```",
        permissions: "",
        usage: "```\nplaying\n```",
        params: "",
        description: "If it's playing, shows song that is now playing.",
        required: "",
        exception: "",
        category: "```\nmusic\n```",
      },
      volume: {
        aliases: "```\nvol\n```",
        permissions: "",
        usage: "```\nvolume\nvolume [hlasitost]\n```",
        params: "```\n[hlasitost] - The volume that will be set.\n```",
        description: "Shows the current volume.\n Sets the volume.",
        required: "```\nBe in any voice channel with the bot.\n```",
        exception: "",
        category: "```\nmusic\n```",
      },
      vol: {
        aliases: "```\nvolume\n```",
        permissions: "",
        usage: "```\nvol\nvol [hlasitost]\n```",
        params: "```\n[hlasitost] - The volume that will be set.\n```",
        description: "Shows the current volume.\n Sets the volume.",
        required: "```\nBe in any voice channel with the bot.\n```",
        exception: "",
        category: "```\nmusic\n```",
      },
      queue: {
        aliases: "```\nq\n```",
        permissions: "",
        usage: "```\nqueue\nqueue [page]\n```",
        params: "",
        description:
          "Shows the first page of the queue.\nShows specific page of the queue.",
        required: "",
        exception: "",
        category: "```\nmusic\n```",
      },
      q: {
        aliases: "```\nqueue\n```",
        permissions: "",
        usage: "```\nq\nq [page]\n```",
        params: "",
        description:
          "Shows the first page of the queue.\nShows specific page of the queue.",
        required: "",
        exception: "",
        category: "```\nmusic\n```",
      },
      join: {
        aliases: "",
        permissions: "",
        usage: "```\njoin\n```",
        params: "",
        description: "If not, the bot connects to the sender's voice channel.",
        required: "```\nBe in any voice channel.\n```",
        exception: "",
        category: "```\nmusic\n```",
      },
      leave: {
        aliases: "",
        permissions: "",
        usage: "```\nleave\n```",
        params: "",
        description:
          "If the bot is connected to a voice channel, it will disconnect.",
        required: "```\nBe in any voice channel with the bot.\n```",
        exception: "",
        category: "```\nmusic\n```",
      },
      pause: {
        aliases: "",
        permissions: "",
        usage: "```\npause\n```",
        params: "",
        description: "If a song is playing, it pauses it.",
        required: "```\nBe in any voice channel with the bot.\n```",
        exception: "",
        category: "```\nmusic\n```",
      },
      resume: {
        aliases: "",
        permissions: "",
        usage: "```\nresume\n```",
        params: "",
        description: "If the song is paused, it resumes.",
        required: "```\nBe in any voice channel with the bot.\n```",
        exception: "",
        category: "```\nmusic\n```",
      },
      loop: {
        aliases: "",
        permissions: "",
        usage: "```\nloop\n```",
        params: "",
        description:
          "Turns on or off the repeat of the song that is currently playing.",
        required: "```\nBe in any voice channel with the bot.\n```",
        exception: "",
        category: "```\nmusic\n```",
      },
      shuffle: {
        aliases: "",
        permissions: "",
        usage: "```\nshuffle\n```",
        params: "",
        description: "Shuffles the queue.",
        required: "```\nBe in any voice channel with the bot.\n```",
        exception: "",
        category: "```\nmusic\n```",
      },
      autorole: {
        aliases: "",
        permissions: "```\nADMINISTRATOR\nor MANAGE_ROLES\n```",
        usage: "```\nautorole\nautorole add [@role]\nautorole on/off\n```",
        params: "",
        description:
          "Autorole - the role that is automatically assigned to every new user in the server. \nShows the current autoroles. \n Adds the autorole. \nEnables or disables role adding.",
        required: "",
        exception: "",
        category: "```\nmoderation\n```",
      },
      channel: {
        aliases: "",
        permissions: "```\nADMINISTRATOR\nor MANAGE_CHANNELS\n```",
        usage: "```\nchannel wel/bye\nchannel wel/bye set [#kanál]\n```",
        params: "```\nwel/bye - Determines the channel.\n```",
        description:
          "Shows the current wel/bye channel.\nSets new wel/bye channel.\n\n**Channel types:** \n`wel` - welcome channel, where new members are announced\n`bye` - bye channel, where is announced abandonment of members",
        required: "",
        exception: "",
        category: "```\nmoderation\n```",
      },
      ping: {
        aliases: "",
        permissions: "",
        usage: "```\nping\n```",
        params: "",
        description: "Shows bot's ping and Discord API latency.",
        required: "",
        exception: "",
        category: "```\nother\n```",
      },
      twitch: {
        aliases: "",
        permissions: "```\nADMINISTRATOR\n```",
        usage:
          "```\ntwitch user\ntwitch user set [twitch uživatel]\ntwitch notifichannel/nc\ntwitch notifychannel/nc set [#channel]\ntwitch on/off\n```",
        params: "```\n\n```",
        description:
          "Shows current twitch user for announcing his streams.\nSet new twitch user for announcing his streams.\nShows current channel, that is used to send the announcements to streams.\nSets new channel, that is used to send the announcements to streams.\nEnables or disables stream announcements.",
        required: "",
        exception: "",
        category: "```\ntwitch\n```",
      },
      help: {
        aliases: "",
        permissions: "",
        usage: "```\nhelp\nhelp [category/command]\n```",
        params: "",
        description:
          "Shows a list of all categories.\nShows commands in certain category or usage of certain command.",
        required: "",
        exception: "",
        category: "```\nhelp\n```",
      },
      prefix: {
        aliases: "",
        permissions: "```\nADMINISTRATOR\n```",
        usage: "```\nprefix\nprefix set [new prefix]\n```",
        params: "```\n\n```",
        description:
          "Shows current prefix for the server.\nSets prefix for the server.",
        required: "",
        exception: "",
        category: "```\nsettings\n```",
      },
      penis: {
        aliases: "",
        permissions: "",
        usage: "```\npenis\npenis [@member]\npenis [anything]\n```",
        params:
          "```\n[@member] - The mention of any member from the server.\n[anything] - Anything.\n```",
        description:
          'Mentions the author and generates random number (1 - 35) for "lenght" of his pen*s.\nGenerates random number (1 - 35) for "lenght" of mentioned member\'s pen*s.\n\nEverything is meant only for fun without the purpose of offending anyone or anything.',
        required: "",
        exception: "",
        category: "```\nfun\n```",
      },
      howgay: {
        aliases: "```\nhg\n```",
        permissions: "",
        usage: "```\nhowgay\nhowgay [@member]\nhowgay [anything]\n```",
        params:
          "```\n[@member] - The mention of any member from the server.\n[cokoliv] - Anything.\n```",
        description:
          'Mentions the author and generates random percents for "how much is gay".\nGenerates random percents for "how much is gay" mentioned member or thing.\n\nEverything is meant only for fun without the purpose of offending anyone or anything.',
        required: "",
        exception: "",
        category: "```\nfun\n```",
      },
      hg: {
        aliases: "```\nhowgay\n```",
        permissions: "",
        usage: "```\nhg\nhg [@member]\nhg [anything]\n```",
        params:
          "```\n[@member] - The mention of any member from the server.\n[anything] - Anything.\n```",
        description:
          'Mentions the author and generates random percents for "how much is gay".\nGenerates random percents for "how much is gay" mentioned member or thing.\n\nEverything is meant only for fun without the purpose of offending anyone or anything.',
        required: "",
        exception: "",
        category: "```\nfun\n```",
      },
      counters: {
        aliases: "",
        permissions: "```\nADMINISTRATOR\nMANAGE_CHANNELS\n```",
        usage:
          "```\ncounters setup\ncounters create\ncounters reset\ncounters customize\n```",
        params: "",
        description:
          "Makes required setup of counters (category, 3 basic counters). \nCreated new counter if the setup is maked. \nRemoves all channels and categories associated with counters.",
        required: "",
        exception: "",
        category: "```\ncounters\n```",
      },
      clear: {
        aliases: "```\nc\n```",
        permissions:
          "```\nADMINISTRATOR\nMANAGE_MESSAGES\nMANAGE_CHANNELS\n```",
        usage: "```\nclear [number]\n```",
        params:
          "```\n[number] - Number of messages to delete, the message with this command is also counted.\n```",
        description: "Deletes messages in the channel.",
        required: "",
        exception: "",
        category: "```\nother\n```",
      },
      c: {
        aliases: "```\nclear\n```",
        permissions:
          "```\nADMINISTRATOR\nMANAGE_MESSAGES\nMANAGE_CHANNELS\n```",
        usage: "```\nc [number]\n```",
        params:
          "```\n[number] - Number of messages to delete, the message with this command is also counted.\n```",
        description: "Deletes messages in the channel.",
        required: "",
        exception: "",
        category: "```\nother\n```",
      },
      eval: {
        aliases: "",
        permissions: "",
        usage: "```\ndev\n```",
        params: "",
        description: "Command for developers only.",
        required: "",
        exception: "",
        category: "```\ndev\n```",
      },
      dev: {
        aliases: "",
        permissions: "",
        usage: "```\ndev\n```",
        params: "",
        description: "Command for developers only.",
        required: "",
        exception: "",
        category: "```\ndev\n```",
      },
      meme: {
        aliases: "",
        permissions: "",
        usage: "```\nmeme\n```",
        params: "",
        description: "Sends random meme picture from internet.",
        required: "",
        exception: "",
        category: "```\nfun\n```",
      },
      rr: {
        aliases: "```\nreactionroles\n```",
        permissions: "```\nADMINISTRATOR\n```",
        usage: "```\nreactionroles create\n```",
        params: "",
        description:
          "Starts a program to create a reaction role message for adding roles. The bot automatically adds a role to whoever react to the created message. At the same time, removing the reaction removes the role.",
        required: "",
        exception: "",
        category: "```\nmoderation\n```",
      },
      reactionroles: {
        aliases: "```\nrr\n```",
        permissions: "```\nADMINISTRATOR\n```",
        usage: "```\nrr create\n```",
        params: "",
        description:
          "Starts a program to create a reaction role message for adding roles. The bot automatically adds a role to whoever react to the created message. At the same time, removing the reaction removes the role.",
        required: "",
        exception: "",
        category: "```\nmoderation\n```",
      },
      tc: {
        aliases: "```\ntempchannel\ntempchan\n```",
        permissions: "",
        usage: "```\ntc create\ntc add\ntc remove\n```",
        params: "",
        description:
          "Creates private channel (you will find it on the bottom of all channels). \nGrants permissions to see the channel and join to the member / members. \nRemoves permissions to see the channel and join to the member / members.",
        required: "",
        exception: "",
        category: "```\ntempchannel\n```",
      },
      tempchan: {
        aliases: "```\ntempchannel\ntc\n```",
        permissions: "",
        usage: "```\ntempchan create\ntempchan add\ntempchan remove\n```",
        params: "",
        description:
          "Creates private channel (you will find it on the bottom of all channels). \nGrants permissions to see the channel and join to the member / members. \nRemoves permissions to see the channel and join to the member / members.",
        required: "",
        exception: "",
        category: "```\ntempchannel\n```",
      },
      tempchannel: {
        aliases: "```\ntc\ntempchan\n```",
        permissions: "",
        usage:
          "```\ntempchannel create\ntempchannel add\ntempchannel remove\n```",
        params: "",
        description:
          "Creates private channel (you will find it on the bottom of all channels). \nGrants permissions to see the channel and join to the member / members. \nRemoves permissions to see the channel and join to the member / members.",
        required: "",
        exception: "",
        category: "```\ntempchannel\n```",
      },
      queueloop: {
        aliases: "```\nloopqueue\n```",
        permissions: "",
        usage: "```\nqueueloop\n```",
        params: "",
        description:
          "Enables or disables queue looping. *To loop one song use* `loop`",
        required: "Be in any voice channel with the bot.",
        exception: "",
        category: "```\nmusic\n```",
      },
      loopqueue: {
        aliases: "```\nqueueloop\n```",
        permissions: "",
        usage: "```\nloopqueue\n```",
        params: "",
        description:
          "Enables or disables queue looping. *To loop one song use* `loop`",
        required: "Be in any voice channel with the bot.",
        exception: "",
        category: "```\nmusic\n```",
      },
      remove: {
        aliases: "```\nrm\n```",
        permissions: "",
        usage: "```\nremove [index]\n```",
        params: "```\n[index] - The order of the song in the queue.\n```",
        description: "Removes a specific song from the queue.",
        required: "Be in any voice channel with the bot.",
        exception: "",
        category: "```\nmusic\n```",
      },
      rm: {
        aliases: "```\nremove\n```",
        permissions: "",
        usage: "```\nrm [index]\n```",
        params: "```\n[index] - The order of the song in the queue.\n```",
        description: "Removes a specific song from the queue.",
        required: "Be in any voice channel with the bot.",
        exception: "",
        category: "```\nmusic\n```",
      },
      calladmin: {
        aliases: "```\nca\n```",
        permissions: "",
        usage: "```\ncalladmin\n```",
        params: "",
        description:
          "Bot will call admin (it will send him link to he message), then admin can contact you about the problem.",
        required: "",
        exception: "",
        category: "```\nother\n```",
      },
      ca: {
        aliases: "```\ncalladmin\n```",
        permissions: "",
        usage: "```\nca\n```",
        params: "",
        description:
          "Bot will call admin (it will send him link to he message), then admin can contact you about the problem.",
        required: "",
        exception: "",
        category: "```\nother\n```",
      },
      antispam: {
        aliases: "```\nas\n```",
        permissions: "```\nADMINISTRATOR\n```",
        usage:
          "```\nantispam enable\nantispam disable\nantispam delay\nantispam delay [ms]\nantispam reset [@member]\nantispam ignoreadmins\nantispam ignoreadmins [true/false]\n```",
        params: "[ms] - Delay in milliseconds. (1 second = 1000 milliseconds)",
        description:
          "Enables antispam protection.\nDisables antispam protection.\nTells the current delay.\nSets the delay.\nResets records for certain member, is able to mention multiple members or everyone.\n-\nEnables or disables admin ignoring.\n\nDelay: Delay between sent messages, what the bot will treat as spam, simplified, it is speed of sending messages (the smaller the number, the higher the speed).",
        required: "",
        exception: "",
        category: "```\nmoderation\n```",
      },
      as: {
        aliases: "```\nantispam\n```",
        permissions: "```\nADMINISTRATOR\n```",
        usage:
          "```\nas enable\nas disable\nas delay\nas delay [ms]\nas reset [@member]\nas ignoreadmins\nas ignoreadmins [true/false]\n```",
        params: "[ms] - Delay in milliseconds. (1 second = 1000 milliseconds)",
        description:
          "Enables antispam protection.\nDisables antispam protection.\nTells the current delay.\nSets the delay.\nResets records for certain member, is able to mention multiple members or everyone.\n-\nEnables or disables admin ignoring.\n\nDelay: Delay between sent messages, what the bot will treat as spam, simplified, it is speed of sending messages (the smaller the number, the higher the speed).",
        required: "",
        exception: "",
        category: "```\nmoderation\n```",
      },
      clearqueue: {
        aliases: "```\nqueueclear\n```",
        permissions: "",
        usage: "```\nclearqueue\n```",
        params: "",
        description: "Clears the queue.",
        required: "",
        exception: "",
        category: "```\nmusic\n```",
      },
      queueclear: {
        aliases: "```\nclearqueue\n```",
        permissions: "",
        usage: "```\nqueueclear\n```",
        params: "",
        description: "Clears the queue.",
        required: "",
        exception: "",
        category: "```\nmusic\n```",
      },
      settings: {
        aliases: "",
        permissions: "```\nADMINISTRATOR\n```",
        usage:
          "```\nsettings announce on/off/short\nsettings defaultvolume [volume]\nsettings blacklist [#channel]\n```",
        params:
          "[volume] - Number between 1 and 100. \n[#channel] - Mentioned channnel.",
        description:
          "Switches between song announcement modes. \nSets default volume. \nAdds or removes channel from blacklist.",
        required: "",
        exception: "",
        category: "```\nsettings\n```",
      },
    },
  },

  /// MUSIC ///
  musicBotHasNoPermission:
    "**<:tickNo:870239550163779604> I have no permissions to speak or join or I cannot see your channel!**",
  musicNoQuery:
    "**<:tickNo:870239550163779604> You need to type in some query!**",
  musicSearching:
    "**<:youtube:870237940465422366> I'm searching :mag_right:** `%query%`", // %query% for query
  musicGetting:
    "**<:youtube:870237940465422366> Getting informations... :mag_right:** `%query%`", // %query% for query
  musicPlaylistAddToQueue:
    ":musical_note: (%songs%) Added to the queue :musical_note:", // %songs% for number of songs
  musicName: "`Name`",
  musicNumberOfSongsAdded: "`Songs added`",
  musicDuration: "`Duration`",
  musicAuthor: "`Author`",
  musicProgress: "`Progress`",
  musicError:
    "**<:tickNo:870239550163779604> Some error occurred, admin has been informed!**",
  musicWrongUrl: "**<:tickNo:870239550163779604> Wrong url.**",
  musicSongAddToQueue: ":musical_note: Added to the queue :musical_note:",
  musicSearch: ":mag_right: **Search** :page_facing_up: \n%tracks%", // %tracks% for searched result tracks
  musicNowPlaying: ":musical_note: Now playing :musical_note:",
  musicNothingPlaying: "<:tickNo:870239550163779604> **Nothing is playing.**",
  musicEmptyQueue: "**Queue is empty.**",
  musicAlreadyInChannel:
    "**<:tickNo:870239550163779604> I'm already in this channel.**",
  musicTypeNumber:
    "**Type in number of song you want to play / add to queue.**",
  musicAlreadyInTheChannel: "**:thumbsup: I'm already in your channel.**",
  musicNothingFound: "**<:tickNo:870239550163779604> Nothing has been found.**",
  music: {
    error: "**<:tickNo:870239550163779604> Error occured: `%errr%`**",
    channelBlacklisted:
      "**:no_entry_sign: This text channel cannot be used for music commands.**",
    botIsPlaying:
      "**<:tickNo:870239550163779604> Bot is playing elsewhere, join his channel and play your music.**",
    invalidNumber:
      "**<:tickNo:870239550163779604> Use positive number greater than zero.**",
    remove: {
      removed: "**<:tickYes:870238031603462154> Removed:** `%title%`", // %title% for song title
      songNotExist:
        "**<:tickNo:870239550163779604> The song on this index doesn't exist.**",
      invalidNumber:
        "**<:tickNo:870239550163779604> Use positive number greater than zero.**",
      use: "**<:tickNo:870239550163779604> Usage: `remove [index]`**",
    },
    queue: {
      queue: ":page_facing_up: Queue:",
      cleared: "<:tickYes:870238031603462154> **Queue has been cleared.**",
      nextInQueue: "**__Next in the queue:__**",
      playing: "**__Playing:__**",
      shuffled: "**:cloud_tornado: Queue has been shuffled.**",
      invalidPage: "**<:tickNo:870239550163779604> This page doesn't exist.**",
      footer: "Page: %page%/%pages% | Loop: %loop% | Queue Loop: %qloop%", // %page% for number of current page, %pages% for number of all pages
      invalidNumber: "**<:tickNo:870239550163779604> Use valid number.**",
      anotherPageUse: 'Use: "queue <page>" for next page.',
    },
    loop: {
      enabled: "**:repeat_one: Enabled!**",
      disabled: "**:repeat_one: Disabled!**",
      queue: {
        enabled: "**:repeat_one: Queue looping has been enabled!**",
        disabled: "**:repeat_one: Queue looping has been disabled!**",
      },
    },
    need: {
      toBeInVoice:
        "<:tickNo:870239550163779604> **You need to be in voice channel to use this command.**",
      toBeInVoiceWithBot:
        "<:tickNo:870239550163779604> **You need to be in voice channel with me to use this command.**",
    },
    skip: {
      voting:
        "**Skip?** (**1/%needed%** people) \n**Use: **`%prefix%forceskip` **or** `%prefix%fs` **to force.**", // %needed% for count of members in the channel, %prefix% for prefix mention
      newSkip: "**Skip?** (**%voted%/%needed%** lidí)", // %needed% for count of members in the channel, %voted% for voted count
      FSkipped: ":fast_forward: **Force skipped** :thumbsup:",
      FSNoPermission:
        "**<:tickNo:870239550163779604> **This command requires you to either have a role named** `DJ` **or the** `Manage channels` **permission to use it** *(being alone with the bot also works)*", // %prefix% for prefix mention
      FSNoPermission2:
        "**<:tickNo:870239550163779604> **This command requires you to either have a role named** `DJ` **or** `%role%` **or the** `Správa kanálů` **permission to use it** *(being alone with the bot also works)*",
      alreadyVoted: "**:thumbsup: You have already voted.**",
      skipped: ":fast_forward: **Skipped** :thumbsup:",
      differentUUID:
        ":x: **This control panel is expired, use the newest one.**",
    },
    otherCmds: {
      disconnect: ":stop_button: **Disconnected!** :thumbsup:",
      alreadyPaused: ":pause_button: **Playback is already paused.**",
      pause: ":pause_button: **Playback has been stopped.**",
      alreadyResumed: ":play_pause: **Playback is already resumed.**",
      resume: ":play_pause: **Playback has been resumed.**",
      stopped: ":stop_button: **Stopped!** :thumbsup:",
      joined: "**:thumbsup: Connected to `%voice%` :speaker:**", // %voice% for voice channel name
    },
    volume: {
      currentVolume: "**:loud_sound: Current volume is:** `%volume%`", // %volume% for current volume
      set: ":loud_sound: **Volume has been set to:** `%volume%`", // %volume% for set volume
      use: "<:tickNo:870239550163779604> **Allowed value is from** `1` **to** `100`",
    },
    seek: {
      invalidNumber:
        "**<:tickNo:870239550163779604> Use number from 0 to leght of the song.**",
      usage: "**:warning: Usage: `seek [0 - lenght]`.**",
      seek: "**<:tickYes:870238031603462154> Playback position has been set to `%time%` :fast_forward:**",
    },
  },

  /// AUTOROLE ///
  autorole: {
    enabled:
      "**<:tickYes:870238031603462154> Autorole adding has been enabled.**",
    disabled: "**:warning: Autorole adding has been disabled.**",
    enabledButNotSet:
      "*:warning: No one is set. Use `autorole add [@role]` to set the autorole.*",
  },
  autoroleInfo: "**:thumbsup: Current autoroles are:** %roles% ", // %role% for roles list
  autoroleSetDoesntExist:
    "<:tickNo:870239550163779604> The autorole no longer exists.",
  autoroleNotSet: "**:thumbsdown: Autorole aren't set.**",
  autoroleUse: "**Use:** `autorole add <role>`",
  autoroleAdd:
    "**:thumbsup: These roles have been added to the autoroles:** %roles%", // %role% for role mention
  autoroleRemove:
    "**:thumbsup: These roles have been removed from the autoroles:** %roles%", // %role% for role mention
  autoroleNotFoundOrNoMention:
    "**<:tickNo:870239550163779604> Role not found, use `@` to mention.**",

  /// COUNTERS ///
  countSetupFinished:
    "**<:tickYes:870238031603462154> The setup has finished and will update counters *every 10 minutes*.** \n*Type in* `%prefix%counters create` *to create new counter.*", // %prefix% for prefix
  countCategoryName: "📈 Server Stats 📊",
  countAllName: "👥 All members: %count%",
  countOnlyMembersName: "👤 Members: %count%",
  countOnlyBotsName: "👮 Bots: %count%",
  countOnlineMembers: "✅ Online Members: %count%",
  countOfflineMembers: "✖️ Offline Members: %count%",
  countIdleMembers: "💤 Idle Members: %count%",
  countDndMembers: "⛔ DnD Members: %count%",
  countNotOfflineMembers: "✔️ Not Offline Members: %count%",
  countRoles: "🎨 Roles: %count%",
  countChannels: "🏷️ Channels: %count%",
  countText: "📃 Text channels: %count%",
  countVoice: "🎤 Voice channels: %count%",
  countCategories: "🔖 Categories: %count%",
  countStages: "🎙️ Stages: %count%",
  countAnnouncement: "📰 Announcement channels: %count%",
  countEmojis: "🤪 Emojis: %count%",
  countBoosters: "🚀 Server Boosters: %count%",
  countTier: "🔮 Server Tier: %count%",

  countSetupAlreadyDone:
    "**<:tickNo:870239550163779604> The setup is already finished, use** `%prefix%counters reset` **to reset the setup.**",
  countSetupNotDone:
    "**<:tickNo:870239550163779604> The setup isn't yet finished, use** `%prefix%counters setup` **to create the setup.**",
  countCustomize:
    "**You can freely customize channels and categories, just don't move channels from category, when you delete the category, it will be created agai. When renaming use any number, it will be automatically set to the correct values!**",
  countChooseTypeOfCounter:
    "**From following list choose type of the counter and type it in the chat**\n`all`, `members`, `bots`, `online`, `idle`, `dnd`, `roles`, `channels`, `text`, `voice`, `categories`, `announcement`, `stages`, `emojis`, `boosters`, `tier` \n**on** `cancel` **to cancel action.**",
  countCounterCreated:
    "**<:tickYes:870238031603462154> Counter has been created.**",
  countResetSuccesful:
    "**<:tickYes:870238031603462154> All counters have been removed.**",
  count: {
    botHasNoPermission:
      "**<:tickNo:870239550163779604> I need permission to **`MANAGE_CHANNELS`",
    noPermission:
      "**:warning: Counters - I need permissions to **`MANAGE_CHANNELS`**. Without them I cannot edit the statistics.**",
    invalidType: "**<:tickNo:870239550163779604> This type isn't supported.**",
  },

  /// REACTION ROLES ///
  rr: {
    atLeastOnePair:
      "**<:tickNo:870239550163779604> You need to specify at least one pair of the role and emoji.**",
    invalidChannel:
      "**<:tickNo:870239550163779604> Channel not found, use `#` to mention.**",
    invalidEmoji:
      "**<:tickNo:870239550163779604> Use correct unicode emoji, or discord emoji.**",
    invalidRole:
      "**<:tickNo:870239550163779604> Role not found, use `@` to mention.**",
    botCannotAddThisRole:
      "**<:tickNo:870239550163779604> I cannot use this role, because it is higher then mine.** \n**:thumbsup: Use another one.**",
    botHasNoPermission:
      "**<:tickNo:870239550163779604> I don't have permission to **`MANAGE_ROLES`**!**",
    succesfulCreated:
      "<:tickYes:870238031603462154> **Reaction role message has been succesfully created. \n** %url%",
  },

  tc: {
    channelCreated:
      "**<:tickYes:870238031603462154> Your channel has been created (you will find it all the way down), invite your friend using: `tc add [@member]`**",
    voiceName: "🔈 Temp channel for %username%",
    categoryName: "🗣 Temp channels 👥",
    noChannelForUser:
      "**<:tickNo:870239550163779604> You haven't channel yet.**",
    alreadyCreated:
      "**<:tickNo:870239550163779604> You have created one yet, you can create just one.**",
    added:
      "**<:tickYes:870238031603462154> Your friend or friends have been added.**",
    removed: "**:wastebasket: Your friend or friends have been removed.**",
    mentionAtLeastOne:
      "**<:tickNo:870239550163779604> You need to mention at least ONE member with `@`.**",
  },

  /// CLEAR ///
  clear: {
    wrongNumber:
      "**<:tickNo:870239550163779604> Wrong number, use number from 1 to 100.**",
    use: "**<:tickNo:870239550163779604> Use: `clear [number from 1 to 100]`.**",
    fetching: ":mag_right: **Fetching the messages...** :page_with_curl:",
    deleting: ":wastebasket: **Deleting...**",
    oldMessages:
      ":warning: **Some messages cannot be deleted because they are older than 14 days.**",
  },

  /// ANTISPAM ///
  antispam: {
    cmds: {
      notFoundOrNoMention:
        "**<:tickNo:870239550163779604> Member not found, use `@` to mention.**",
      allReset:
        "<:tickYes:870238031603462154> **Everyone's spam data has been deleted.**",
      reset:
        "<:tickYes:870238031603462154> **Spam data has been deleted for %count% members.**",
      enabled:
        "<:tickYes:870238031603462154> **Antispam function has been enabled.**\n*I recommend to move %role% high as possible, otherwise it might not work properly.*",
      disabled: ":warning: **Antispam function has been disabled.**",
      alreadyEnabled:
        "<:tickNo:870239550163779604> **Antispam function is already enabled.**",
      alreadyDisabled:
        "<:tickNo:870239550163779604> **Antispam function is already disabled.**",
      resetUse:
        "<:tickNo:870239550163779604> **Usage: `antispam reset [@member / @everyone]`**",
      invalidNumber: "**<:tickNo:870239550163779604> Use valid number.**",
      delaySet:
        "<:tickYes:870238031603462154> **Delay has been set to `%delay%ms`.**",
      delay: "<:tickYes:870238031603462154> **Delay is set to `%delay%ms`.**",
      ignoreAdminsSet:
        "<:tickYes:870238031603462154> **Admin ignoring has been set to `%boolean%`.**",
      useBoolean: "<:tickNo:870239550163779604> **Use `false` or `true`.**",
      ignoreAdmins:
        "<:tickYes:870238031603462154> **Admn ignoring is set to `%boolean%`.**",
      antispam: "Antispam",
      tracking: "`Tracking:`",
      users: " users",
      dela: "`Delay:`",
      ignor: "`Admin ignoring:`",
      enabledLabel: "`Enabled:`",
    },
    util: {
      stopSpaming: ":warning: **Stop spaming, you might be muted.**",
    },
  },

  /// SETTINGS ///
  settings: {
    dvol: {
      vol: "**:sound: Default volume is set to `%vol%`**",
      invNumber:
        "**<:tickNo:870239550163779604> Use number between 1 and 100.**",
      set: "**<:tickYes:870238031603462154> Default volume has been set to `%vol%`.**",
    },
    blacklist: {
      specifyChannels:
        "**<:tickNo:870239550163779604> You need to mention at least one channel.**",
      alreadyAdded:
        "**<:tickNo:870239550163779604> Channels \n%channels% are already on the blacklist.**",
      channelIsnt:
        "**<:tickNo:870239550163779604> Channels \n%channels% aren't on the blacklist.**",
      succesfulRemove:
        "**<:tickYes:870238031603462154> Channels \n%channels% have been removed from the blacklist.**",
      succesful:
        "**<:tickYes:870238031603462154> Channels \n%channels% have been added to the blacklist.**",
      info: "**:scroll: These are the all channels on the blacklist: \n %channels%**",
    },
    annouce: {
      set: "**<:tickYes:870238031603462154> Announcements has been set to `%mode%`**",
      mode: "**:gear: Announcement mode is set to `%mode%`**",
      use: "**:warning: Usage: `settings announce on/off/short`**",
    },
  },

  urban: {
    enterQuery: ":x: **You need to enter some search query.**",
    nothingFound: ":mag: **Nothing has been found.**",
  },
};
