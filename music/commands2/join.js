const Discord = require("discord.js");
const music = require("../music");
const error = require("../../utils/error");
const template = require("string-placeholder");
const Guild = require("../../models/guild");
const voice = require("@discordjs/voice");
const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "join",
  cooldown: 3,
  aliases: [],
  category: "music",
  async execute(int, serverQueue, Gres) {
    let voiceChannel = int.member.voice.channel;
    if (!voiceChannel) {
      if (
        int.channel
          .permissionsFor(int.guild.members.me)
          .has(Discord.PermissionFlagsBits.SendMessages)
      ) {
        followReply(int, { content: LMessages.music.need.toBeInVoice });
      }
      return;
    }
    await Guild.updateOne(
      {
        guildID: int.guild.id,
      },
      {
        musicBotTxtChannelID: int.channel.id,
      }
    );
    try {
      if (int.guild.members.me.voice.channel) {
        if (int.guild.members.me.voice.channel.id == voiceChannel.id) {
          if (
            int.channel
              .permissionsFor(int.guild.members.me)
              .has(Discord.PermissionFlagsBits.SendMessages)
          ) {
            followReply(int, {
              content: LMessages.musicAlreadyInTheChannel,
            });
          }
        }
        if (int.guild.members.me.voice.channel.id != voiceChannel.id) {
          if (
            int.channel
              .permissionsFor(int.guild.members.me)
              .has(Discord.PermissionFlagsBits.SendMessages)
          ) {
            followReply(int, {
              content: template(
                LMessages.music.otherCmds.joined,
                { voice: voiceChannel.name },
                { before: "%", after: "%" }
              ),
            });
          }
          await Guild.updateOne(
            {
              guildID: int.guild.id,
            },
            {
              musicBotLoop: false,
              musicBotQueueLoop: false,
            }
          );
        }
      } else {
        if (
          int.channel
            .permissionsFor(int.guild.members.me)
            .has(Discord.PermissionFlagsBits.SendMessages)
        ) {
          followReply(int, {
            content: template(
              LMessages.music.otherCmds.joined,
              { voice: voiceChannel.name },
              { before: "%", after: "%" }
            ),
          });
        }
        await Guild.updateOne(
          {
            guildID: int.guild.id,
          },
          {
            musicBotLoop: false,
            musicBotQueueLoop: false,
          }
        );
      }
      if (
        voiceChannel
          .permissionsFor(int.guild.members.me)
          .has(Discord.PermissionFlagsBits.ManageRoles)
      ) {
        if (!serverQueue) {
          music.queue.set(voiceChannel.guild.id, {
            connection: null,
            songs: [],
          });
          serverQueue = music.queue.get(voiceChannel.guild.id);
        }
        const lastCon = serverQueue.connection;
        if (!lastCon || lastCon.joinConfig.channelId != voiceChannel.id) {
          serverQueue.connection = voice.joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          });
          music.stateChange(serverQueue, int.guild);
        }
        try {
          await voice.entersState(
            serverQueue.connection,
            voice.VoiceConnectionStatus.Ready,
            10000
          );
        } catch (err) {
          try {
            throw Error(err);
          } catch (err) {
            console.error(err);
            error.sendError(err);
          }
          music.queue.delete(int.guild.id);
          if (
            int.channel
              .permissionsFor(int.guild.members.me)
              .has(Discord.PermissionFlagsBits.SendMessages)
          ) {
            followReply(int, { content: LMessages.musicError });
          }
          return;
        }
      }
    } catch (err) {
      console.error(err);
      error.sendError(err);
      music.queue.delete(int.guild.id);

      if (
        int.channel
          .permissionsFor(int.guild.members.me)
          .has(Discord.PermissionFlagsBits.SendMessages)
      ) {
        followReply(int, { content: LMessages.musicError });
      }
      return;
    }
  },
};
