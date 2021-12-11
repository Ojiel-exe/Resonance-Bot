const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const { stripIndents } = require("common-tags");
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "channel",
    aliases: ["c"],
    description: "Set Channel Lockdown Or Unlock",
    category: "administration",
    timeout: 5000,
    usage: "!channel",
    userPermissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
    botPermissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
    run: async(client, message, args) => {
        if(message.deletable) message.delete({timeout : 4000}) 
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

       const embed = new MessageEmbed()
        .setColor("DARK-BLUE")
        .setDescription(stripIndents `
        **Welcome To \`Channel Lockdown * Unlockdown\` Command!**
        
        **Please Choose The Option Below**

        <a:icons8dotsloading:> ** Type : \`${p}channel lock <all, only, cancel> <tag role>\` **
        <a:icons8dotsloading:> ** Type : \`${p}channel unlock <all, only, cancel> <tag role>\` **
        `)
        .setFooter(config.footer)
        .setTimestamp()

        if (!args[0]){
            return message.channel.send(embed)
        } 

        if (!['lock', 'unlock',].includes(args[0]))
            return message.reply(`The First Arguments Only Works : \`lock\`, \`unlock\``)

        if (args[0] === 'lock') {
            if (!['all', 'only', 'cancel'].includes(args[1]))
                return message.reply(`The Seconds Arguments Only Works : \`all\`, \`only\`, \`cancel\``)

            if (args[1] === 'all') {
                let role = message.guild.roles.cache.find(r => (r.name === args[2].toString()) || (r.id === args[2].toString().replace(/[^\w\s]/gi, '')));
                if (!role) return message.reply("Please give a valid role id!")

                message.guild.channels.cache.forEach(channel => {
                    channel.updateOverwrite(role, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false,
                        ADD_REACTIONS: false
                    })
                })

                //message.reply('Success To Lock All Channels');

                const embed = new MessageEmbed()
                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(stripIndents `
                    **__(<a:BSG_NoteDiamond:819061083414200321>) Status On Channels Update__**
                    
            > **• \`Username\` | \`${message.author.username}\`**
            > **• \`Message\` | \`Done... | Now The All Channel Has Been Unlock\`**
            > **• \`Note\` | \`Please Type ${p}channel lock all [role id | tag] To Lock All Channels\`**
            `)

                message.author.send(embed)
                message.channel.send(`<@${message.author.id}>, Done.. To Unlock, Please Check Your DM`)
            }
        } else if (args[1] === "only") {
            const channel = message.mentions.channels.first()
            if (!channel) return message.reply("Please mention a valid channel!")

            let role = message.guild.roles.cache.find(r => (r.name === args[2].toString()) || (r.id === args[2].toString().replace(/[^\w\s]/gi, '')));
            if (!role) return message.reply("Please give a valid role id!")

            channel.overwritePermissions(role, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false
            })
        } else if (args[1] === "cancel") {
            return message.reply("Cancel Lock All Or Only Channels")

        } else if (args[0] === 'unlock') {
            if (!['all', 'only', 'cancel'].includes(args[1]))
                return message.reply(`The Seconds Arguments Only Works : \`all\`, \`only\`, \`cancel\``)

            if (args[1] === 'all') {
                let role = message.guild.roles.cache.find(r => (r.name === args[2].toString()) || (r.id === args[2].toString().replace(/[^\w\s]/gi, '')));
                if (!role) return message.reply("Please give a valid role id!")

                message.guild.channels.cache.forEach(channel => {
                    channel.updateOverwrite(role, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true,
                        ADD_REACTIONS: true
                    })
                })

                const embed = new MessageEmbed()
                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(stripIndents `
                    **__(<a:BSG_NoteDiamond:819061083414200321>) Status On Channels Update__**
                    
            > **• \`Username\` | \`${message.author.username}\`**
            > **• \`Message\` | \`Done... | Now The All Channel Has Been Unlock\`**
            > **• \`Note\` | \`Please Type ${p}channel lock all [role id | tag] To Lock All Channels\`**
            `)

                message.author.send(embed)
                message.channel.send(`<@${message.author.id}>, Done.. To Unlock, Please Check Your DM`)

            } else if (args[1] === 'only') {
                const channel = message.mentions.channels.first()
                if (!channel) return message.reply("Please mention a valid channel!")

                let role = message.guild.roles.cache.find(r => (r.name === args[2].toString()) || (r.id === args[2].toString().replace(/[^\w\s]/gi, '')));
                if (!role) return message.reply("Please give a valid role id!")

                channel.overwritePermissions(role, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true
                })
            } else if (args[1] === 'cancel') {
                return message.reply("Cancel Unlock All Or Only Channels")
            }
        }
    }
}