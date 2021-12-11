const ghostPingSchema = require('../../models/guild/ghostping')
const config = require('../../config.json')
const prefix = config.prefix

module.exports = {
    name: "ghostping",
    aliases: ["ghost"],
    description: "Setup Ghost Ping/Message Delete Logs",
    category: "logs",
    // timeout: 5000,
    usage: "!ghostping",
    // userPermissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
    // botPermissions: ["ADMINISTRATOR","MANAGE_CHANNELS"],
    run: async(client, message, args) => {
        const { mentions, guild } = message

         const targetChannel = mentions.channels.first() || guild.channels.cache.get(args[1]);
        if (!targetChannel) {
            message.reply('Please Tag A Channel')
            return
        }

        await ghostPingSchema.findOneAndUpdate({
            _id: guild.id
        }, {
            _id: guild.id,
            channelId: targetChannel.id,
        }, {
            upsert: true
        });
        message.reply('Ghost Ping Channel Set Ready')
    }
}