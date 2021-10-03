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
/*
const Discord = require('discord.js');
const { bot } = require('../../bot');
const music = require('../music');
const error = require('../../utils/error');
const template = require('string-placeholder');
const Guild = require('../../models/guild');
const functions = require('../../utils/functions');
const sec2human = require('sec2human');
const LMessages = require(`../../messages/`);
*/
module.exports = {
  name: "seek",
  cooldown: 2,
  aliases: [],
  category: "music",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    /*if (!message.member.voice.channel || message.member.voice.channel != message.guild.me.voice.channel) {
            if (message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
                message.channel.send(LMessages.music.need.toBeInVoiceWithBot);
            }
            return;
        }
        if (!serverQueue) {
            if (message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
                message.channel.send(LMessages.musicNothingPlaying);
            }
            return;
        }
        if (args[0]) {
            var number = Math.floor(Number(args[0]));
            if (number >= 0 && number <= (serverQueue.songs[0].sDur - 1)) {
                var obj = serverQueue.songs[0];
                obj.seek = number;

                serverQueue.songs.splice(1, 0, obj);
                serverQueue.connection.dispatcher.end();

                message.channel.send(
                    template(LMessages.music.seek.seek,
                        { time: sec2human(number) },
                        { before: "%", after: "%" }
                    )
                )

                Guild.findOneAndUpdate({
                    guildID: message.guild.id
                }, {
                    musicBotSkipVotedMembersID: [],
                    musicBotSkipVotesNeeded: 0
                }, function (err) {
                    if (err) {
                        console.error(err);
                        error.sendError(err);
                        return;
                    }
                });

            } else {
                message.channel.send(LMessages.music.seek.invalidNumber);
                return;
            }
        } else {
            message.channel.send(LMessages.music.seek.usage);
            return;
        }*/
  },
};
