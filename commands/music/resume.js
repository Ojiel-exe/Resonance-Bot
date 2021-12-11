const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
// const prefix = config.prefix

module.exports = {
    name: "resume",
    aliases: ["resume", "r"],
    description: "Resume The Music From Pause",
    category: "music",
    inVoiceChannel: true,
    // timeout: 5000,
    usage: "!resume",
    run: async(client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`❌ | There is nothing in the queue right now!`)
        client.distube.resume(message)
        message.channel.send("Resumed the song for you :)")
    }
}