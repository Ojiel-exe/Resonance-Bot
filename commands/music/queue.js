const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
// const prefix = config.prefix

module.exports = {
        name: "queue",
        aliases: ["q"],
        description: "Get List Music from Queue",
        category: "queue",
        inVoiceChannel: true,
        // timeout: 5000,
        usage: "!queue",
        run: async(client, message, args) => {
                const queue = client.distube.getQueue(message)
                if (!queue) return message.channel.send(`❌ | There is nothing playing!`)
                const q = queue.songs.map((song, i) => `${i === 0 ? "Playing:" : `${i}.`} ${song.name} - \`${song.formattedDuration}\``).join("\n")
                message.channel.send(`✅ | **Server Queue**\n${q}`)
        }
}