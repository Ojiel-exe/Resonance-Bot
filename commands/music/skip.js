 const prefixSchema = require('../../models/cmds/prefix')
 const config = require('../../config.json')
 const prefix = config.prefix

 module.exports = {
     name: "skip",
     aliases: ["skip"],
     description: "Skip The Music",
     category: "music",
     timeout: 5000,
     usage: "!skip",
     run: async(client, message, args) => {
         if (!message.member.voice.channel) return message.reply('Please join a voice channel!');

         client.distube.skip(message)
             await message.channel.send("Skipped current song!")
     }
 }