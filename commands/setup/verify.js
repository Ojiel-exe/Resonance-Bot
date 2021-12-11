const prefixSchema = require('../../models/cmds/prefix')
const verification = require('../../models/guild/verification')
const verifytoggle = require('../../models/toggles/verifytoggle')
const config = require('../../config.json')
const prefix = config.prefix
const { stripIndents } = require("common-tags");
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "verify",
    aliases: ["verify"],
    description: "verify members",
    category: "general",
    // timeout: 5000,
    usage: "!verify",
    run: async (client, message, args) => {
        if (message.deletable) message.delete({
            timeout: 4000
        })


        client.prefix = async function (message) {
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
        await verifytoggle.findOne({ _id: message.guild.id }, async (err, data) => {
            if (!data) {
                const ask = new MessageEmbed()
                    .setTitle(`AFK System Is Deactived`)
                    .addField(`Opps.., Need To Enable The Verification Sistem To Use This Command`, `Commands :*\`${p}verifytoggle\`*`, false)
                    .setColor(config.red)
                    .setFooter(config.footer)
                return message.channel.send(ask)
            }
            if(data){
              if (data.toggle = true) {
                const { guild } = message
                verification.findOne({ _id: guild.id }, async (err, data) => {
                    if (data) {
                        if (message.channel.id === data.Channels) {
                            if (message.content === `${p}verify`) {
                                let me = await message.channel.send('<a:2908loading:860430395652046858> | Please Wait')
                                if (message.member.roles.cache.has(data.role)) {
                                    setTimeout(function () {
                                        me.edit(`<@${message.author.id}>, <:icons8verifiedbadge48:860430101216100353> | Done... You Already Verified!!!`)
                                        me.delete({ timeout: 5000 })
                                        return;
                                    }, 1000)

                                } else if (!message.member.roles.cache.has(data.role)) {
                                    setTimeout(function () {
                                        me.edit(`<@${message.author.id}>, <a:checkblancoo:860398687271780412> | Done...`);
                                        me.delete({ timeout: 5000 })
                                        message.member.roles.add(data.role)
                                    }, 1000)
                                    // let m = await message.channel.send(`${message.author.username} Has Verified`)
                                    const embed = new MessageEmbed()
                                        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
                                        .setDescription(stripIndents`
                        **\`${message.author.username}\` Has Verified <a:checkblancoo:860398687271780412>**

                        **Please Welcome Our New Guest \`${message.author.username}\`**
                        ***Welcome To \`${message.guild.name}\` & Enjoy Our Servers***
                        `)
                                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                                        .setColor(config.green)
                                        .setTimestamp(new Date())
                                        .setFooter(config.footer)

                                    const notice = client.channels.cache.get(data.Channel)
                                    notice.send(embed)

                                }
                            } else {
                                let w = await message.channel.send(`Please Type Verify With Command : \`${p}verify\`\nType The Command At Channel : <#${data.Channels}>`)
                                return w.delete({ timeout: 5000 })
                            }
                        } else {
                            return message.reply(`Unknown Command Verified, Please Type \`${p}verify\``)
                        }
                    } else {
                        let w = await message.channel.send(`You Dont Setup The Verification Channel, Please Setup By Following \`${p}verification\``)
                        // let w = await message.channel.send(`Please Type Verify With Command : \`${p}verify\`\nType The Command At Channel : <#${data.Channels}>`)
                        return w.delete({ timeout: 5000 })
                    }
                })
              }
               if (data.toggle = false) {
                const ask = new MessageEmbed()
                    .setTitle(`Verification System Is Deactived`)
                    .addField(`Opps.., Need To Enable The Verification Sistem To Use This Command`, `Commands : \`${p}verifytoggle\``, false)
                    .setColor(config.red)
                    .setFooter(config.footer)
                return message.channel.send(ask)
              } 
            }
        })
    }
}