const { MessageEmbed } = require('discord.js')
const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const verification = require('../../models/guild/verification')
const boostlogs = require('../../models/guild/boostlogs')
const welcome = require('../../models/guild/welcome')
const leave = require('../../models/guild/leave')
const channelcreate = require('../../models/guild/channelcreates')
const channeldelete = require('../../models/guild/channeldeletes')
const channelupdate = require('../../models/guild/channelupdates')
const ghostPingSchema = require('../../models/guild/ghostping')
const guildmemberupdates = require('../../models/guild/guildmemberupdates')
const guildupdates = require('../../models/guild/guildmemberupdates')
const modlogs = require('../../models/guild/modlogs')
const membercounter = require('../../models/guild/membercounter')
const messagedeletes = require('../../models/guild/messagedeletes')
const messageupdate = require('../../models/guild/messageupdates')
const rolecreate = require('../../models/guild/rolecreates')
const roledelete = require('../../models/guild/roledeletes')
const roleupdates = require('../../models/guild/roleupdates')
const voicestate = require('../../models/guild/voicestates')
const memberlogs = require('../../models/guild/member-logs')


module.exports = {
    name: "resetlogs",
    aliases: ["resetlogsserver"],
    description: "Reset All Event Logger On Database",
    category: "logs",
    // timeout: 5000,
    usage: "!resetlogs",
    // userPermissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
    // botPermissions: ["ADMINISTRATOR","MANAGE_CHANNELS"],
    run: async(client, message, args) => {


        client.prefix = async function(message) {
            let custom;

            const data = await prefixSchema.findOne({ _id: message.guild.id })
                .catch(err => console.log(err))

            if (data) {
                custom = data.Prefix;
            } else {
                custom = prefix;
            }
            return custom;
        }
        const p = await client.prefix(message)

        const { guild } = message

        await channelcreate.findOneAndDelete({ _id: guild.id })
        await channeldelete.findOneAndDelete({ _id: guild.id })
        await channelupdate.findOneAndDelete({ _id: guild.id })
        await ghostPingSchema.findOneAndDelete({ _id: guild.id })
        await guildmemberupdates.findOneAndDelete({ _id: guild.id })
        await guildupdates.findOneAndDelete({ _id: guild.id })
        await leave.findOneAndDelete({ _id: guild.id })
        await modlogs.findOneAndDelete({ _id: guild.id })
        await membercounter.findOneAndDelete({ _id: guild.id })
        await messagedeletes.findOneAndDelete({ _id: guild.id })
        await messageupdate.findOneAndDelete({ _id: guild.id })
        await rolecreate.findOneAndDelete({ _id: guild.id })
        await roledelete.findOneAndDelete({ _id: guild.id })
        await roleupdates.findOneAndDelete({ _id: guild.id })
        await voicestate.findOneAndDelete({ _id: guild.id })
        await memberlogs.findOneAndDelete({ _id: guild.id })
        await welcome.findOneAndDelete({ _id: guild.id })
        await boostlogs.findOneAndDelete({ _id: guild.id })
        await verification.findOneAndDelete({ _id: guild.id })

        message.reply(`All Logs With Database Has Been Reset`)

    }
}