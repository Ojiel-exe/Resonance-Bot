const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
// const prefix = config.prefix

module.exports = {
    name: "autoplay",
    aliases: ["ap"],
    description: "Setup The Bot To Autoplay Random Songs",
    category: "music",
    inVoiceChannel: true,
    timeout: 5000,
    usage: "!autoplay",
    run: async(client, message, args) => {
				const queue = client.distube.getQueue(message)
				if (!queue) return message.channel.send(`❌ | There is nothing in the queue right now!`)
        try {
            const autoplay = queue.toggleAutoplay()
            message.channel.send(`✅ | AutoPlay: \`${autoplay ? "On" : "Off"}\``)
        } catch (e) {
            message.channel.send(`❌ | ${e}`)
        }
    }
}