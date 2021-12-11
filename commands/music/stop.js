const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
// const prefix = config.prefix

module.exports = {
    name: "stop",
    aliases: ["stop"],
    description: "Make The Song Stops",
    category: "music",
    // timeout: 5000,
    usage: "!stop",
    run: async(client, message, args) => {
        if (!message.member.voice.channel) return message.reply('Please join a voice channel!');

        client.distube.stop(message)
            await message.channel.send("stop current song!")
    }
}