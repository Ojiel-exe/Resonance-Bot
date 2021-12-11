const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
// const prefix = config.prefix

module.exports = {
    name: "pause",
    aliases: ["pause"],
    description: "Pause The Music",
    category: "music",
    inVoiceChannel: true,
    timeout: 5000,
    usage: "!pause",
    run: async(client, message, args) => {
				const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`❌ | There is nothing in the queue right now!`)
        if (queue.pause) {
            queue.resume()
            return message.channel.send("Resumed the song for you :)")
        }
        queue.pause()
        message.channel.send("Paused the song for you :)")
            //await message.channel.send("loop current song!")
    }
}