const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
// const prefix = config.prefix

module.exports = {
    name: "loop",
    aliases: ["l"],
    description: "Make The Music Loop",
    category: "music",
    inVoiceChannel: true,
    timeout: 5000,
    usage: "!loop",
    run: async(client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`❌ | There is nothing playing!`)
        let mode = null
        switch (args[0]) {
            case "off":
                mode = 0
                break
            case "song":
                mode = 1
                break
            case "queue":
                mode = 2
                break
        }
        mode = client.distube.setRepeatMode(message, mode)
        mode = mode ? mode === 2 ? "Repeat queue" : "Repeat song" : "Off"
        message.channel.send(`✅ | Set repeat mode to \`${mode}\``)
            //await message.channel.send("loop current song!")
    }
}