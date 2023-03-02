module.exports = {
  /// KATEGORIE ///
  /**
   * music
   * settings
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

  /// PREFIX ///
  prefix: {
    info: "**Current prefix for this guild is: `%prefix%`**", // %guild% for guild name, %prefix% for prefix
    use: "**Use: `prefix set <prefix>`**",
    set: "**<:tickYes:870238031603462154> Prefix for guild `%guild%` has been set to** `%prefix%`", // %guild% for guild name, %prefix% for prefix
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
      other: {
        label: "Other",
        commands: "```\n• ping\n• calladmin\n```",
      },

      music: {
        label: "Music",
        commands:
          "```\n• play [query/url]\n• search [query]\n• stop\n• volume\n• volume [volume]\n• queue\n• queue [page]\n• skip\n• forceskip\n• nowplaying\n• pause\n• resume\n• loop\n• queueloop\n• shuffle\n• join\n• leave\n• clearqueue\n• remove [index]\n• defaultvolume\n• defaultvolume [volume]\n```",
      },

      settings: {
        label: "Settings",
        commands:
          "```\n• prefix\n• prefix set\n• settings annouce\n• settings annouce on/off/short\n• settings defaultvolume\n• settings defaultvolume [volume]\n• settings blacklist [#channel]\n```",
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
};