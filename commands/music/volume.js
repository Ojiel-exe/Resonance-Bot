const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
// const prefix = config.prefix

module.exports = {
    name: "volume",
    aliases: ["v", "vol"],
    description: "Setup The Volume From 0% - 100%",
    category: "music",
    // timeout: 5000,
    usage: "!volume",
    run: async(client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) {
					return message.channel.send(`❌ | There is nothing in the queue right now!`)
				}
        const volume = parseInt(args[0])
        if (isNaN(volume)) {
					return message.channel.send(`❌ | Please enter a valid number from 1 - 100!`)
				}
        queue.setVolume(volume)
        message.channel.send(`✅ | Volume set to \`${volume}\``)
    }
}