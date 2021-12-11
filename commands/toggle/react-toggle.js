// const Levels = require('discord-xp')
const reacttoggle = require('../../models/toggles/reacttoggle')
const config = require('../../config.json')
const { stripIndents } = require("common-tags");
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = {
    name: "reacttoggle",
    aliases: ["rt"],
    description: "Setup Reaction System To On Or Off",
    category: "profile",
    // timeout: 5000,
    usage: "!reacttoggle",
    // userPermissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
    // botPermissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
    run: async (client, message, args) => {
        if (message.deletable) message.delete({ timeout: 5000 })
        reacttoggle.findOne({ _id: message.guild.id }, async (err, data) => {
            if(!data) {
                const embed = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor("RANDOM")
                    .setDescription("```Reaction System Is Offline, Do You Want Set To Online ??```")
                    .setTimestamp();

                const done = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor("RANDOM")
                    .setTimestamp(new Date());

                message.channel.send(embed).then(sentMessage => {
                    sentMessage.react("✅").then(() => sentMessage.react("❌")).then(() => {
                        const filter = (reaction, user) => {
                            return true;
                        }
                        const collector = sentMessage.createReactionCollector(filter);
                        collector.on('collect', async (reaction, user) => {
                            if (reaction.emoji.name === '✅') {
                                sentMessage.delete()
                                new reacttoggle({
                                    _id: message.guild.id,
                                    toggle: true,
                                }).save()

                                done.setDescription(`**Reaction System Is \`Online\`**`)
                                message.channel.send(done)
                            }
                            if (reaction.emoji.name === '❌') {
                                sentMessage.delete()

                                done.setDescription(`**Reaction System Is \`Offline\` **`)
                                message.channel.send(done)

                            }
                        })
                    })
                })
            } 
            if(data) {
                const ask = new MessageEmbed()
                    .setColor("DARK-BLUE")
                    .setDescription(stripIndents`
                    **Welcome To Badword Toggles Command!**
                    
                    **Please Choose The Option Below**

                    <a:HC_arrow1:880710912376459285> ** Press ✅ To Enable Reaction System.**
                    <a:HC_arrow1:880710912376459285> ** Press ❌ To Disable Reaction System.**

                    **\`Please, Must Reply By Click Reaction Within 25 Seconds!\`**
                    `)
                    .setFooter(config.footer)
                    .setTimestamp()

                const choice = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("RANDOM")
                    .setFooter(config.footer)
                    .setTimestamp()

                message.channel.send(ask)
                    .then(sentMessage => {
                        sentMessage.react("✅").then(() => sentMessage.react("❌")).then(() => {
                            const filter = (reaction, user) => {
                                return true;
                            }
                            const collector = sentMessage.createReactionCollector(filter);
                            collector.on('collect', async (reaction, user) => {
                                if (reaction.emoji.name === '✅') {
                                    sentMessage.delete()
                                    if (data.toggle === false) {
                                        data.toggle = true
                                        data.save()
                                        choice.setDescription(`**The Reaction System Is \`Online\` **`)
                                        message.channel.send(choice)
                                    } else {
                                        choice.setDescription(`**The Reaction System Already \`Online\` **`)
                                        message.channel.send(choice)
                                    }
                                }
                                if (reaction.emoji.name === '❌') {
                                    sentMessage.delete()
                                    if (data.toggle === true) {
                                        data.toggle = false
                                        data.save()
                                        choice.setDescription(`**The Reaction System Is \`Offline\` **`)
                                        message.channel.send(choice)
                                    } else {
                                        choice.setDescription(`**The Reaction System Is \`Offline\` **`)
                                        message.channel.send(choice)
                                    }

                                }
                            })
                        })
                    })
            }
       })
    }
}


