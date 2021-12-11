const { Client, MessageEmbed } = require('discord.js')
const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
// const prefix = config.prefix

module.exports = {
    name: "play",
    aliases: ["p"],
    description: "Play The Music",
    category: "music",
    inVoiceChannel: true,
    // timeout: 5000,
    usage: "!play",
    run: async(client, message, args) => {
       	const string = args.join(" ")
        if (!string) return message.channel.send(`❌ | Please enter a song url or query to search.`)
        try {
            client.distube.play(message, string)
        } catch (e) {
            message.channel.send(`❌ | Error: \`${e}\``)
        }
    },
};