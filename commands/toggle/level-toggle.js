// const Levels = require('discord-xp')
const leveltoggle = require('../../models/toggles/leveltoggle')
const config = require('../../config.json')
const { stripIndents } = require("common-tags");
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = {
    name: "level-setup",
    aliases: ["lt", "ls", "leveltoggle","level-toggle"],
    description: "Setup Level System",
    category: "profile",
    // timeout: 5000,
    usage: "!leveltoggle",
    // userPermissions: ["ADMINISTRATOR", "MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    // botPermissions: ["ADMINISTRATOR","MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    run: async (client, message, args) => {
        if (message.deletable) message.delete({ timeout: 5000 })
        leveltoggle.findOne({ _id: message.guild.id }, async (err, data) => {
            if(!data) {
                const embed = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor("RANDOM")
                    .setDescription("```The Level System Need To Make This Available ?```")
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
                                new leveltoggle({
                                    _id: message.guild.id,
                                    toggle: true,
                                }).save()

                                done.setDescription(`**Level System Is \`Online\`**`)
                                message.channel.send(done)
                            }
                            if (reaction.emoji.name === '❌') {
                                sentMessage.delete()

                                done.setDescription(`**Level System Is \`Offline\` **`)
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
                    **Welcome To Level Toggles Command!**
                    
                    **Please Choose The Option Below**

                    <a:arrow1:863782207045632021> ** Press <a:Verified:868099921633480744> To Enable Levels System.**
                    <a:arrow1:863782207045632021> ** Press <a:Silang:869928849784320041> To Disable Levels System.**

                    **\`Please, Must Reply By Click Reaction Within 25 Seconds!\`**
                    `)
                    .setFooter(config.footer)
                    .setTimestamp()

                const choice = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("RANDOM")
                    .setFooter(config.footer)
                    .setTimestamp()

                const msg = await message.channel.send(ask)
                    .then(sentMessage => {
                        sentMessage.react("<a:Verified:868099921633480744>").then(() => sentMessage.react("<a:Silang:869928849784320041>")).then(() => {
                            const filter = (reaction, user) => {
                                return true;
                            }
                            const collector = sentMessage.createReactionCollector(filter);
                            collector.on('collect', async (reaction, user) => {
                                if (reaction.emoji.id === '868099921633480744') {
                                    sentMessage.delete()
                                    if (data.toggle === false) {
                                        data.toggle = true
                                        data.save()
                                        choice.setDescription(`**The Level System Is \`Online\` **`)
                                        message.channel.send(choice)
                                    } else {
                                        choice.setDescription(`**The Level System Already \`Online\` **`)
                                        message.channel.send(choice)
                                    }
                                }
                                if (reaction.emoji.id === '869928849784320041') {
                                    sentMessage.delete()
                                    if (data.toggle === true) {
                                        data.toggle = false
                                        data.save()
                                        choice.setDescription(`**The Level System Is \`Offline\` **`)
                                        message.channel.send(choice)
                                    } else {
                                        choice.setDescription(`**The Level System Is \`Offline\` **`)
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


