const db = require('../../models/cmds/warns')
const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const { stripIndents } = require('common-tags')
const { Client, Message, MessageEmbed } = require('discord.js')


module.exports = {
    name: "warn",
    aliases: ["warning"],
    description: "Check, Give, Remove, Reset Warn Member",
    category: "moderation",
    // timeout: 5000,
    usage: "!warn",
    // userPermissions: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    // botPermissions: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
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
                let members = message.member;
                const choice = new MessageEmbed()
                .setColor("DARK-BLUE")
                .setDescription(stripIndents `
                **Welcome To \`Warning Member\` Command!**
                
                **Please Choose The Option Below**

                <:RG_ServerIcon:912880402488762399> ** Type : \`${p}warn add <user> <reason>\` **
                <:RG_ServerIcon:912880402488762399> ** Type : \`${p}warn remove <user>\` **
                <:RG_ServerIcon:912880402488762399> ** Type : \`${p}warn check <user>\` **
                <:RG_ServerIcon:912880402488762399> ** Type : \`${p}warn clear <user>\` **
                `)
                .setFooter(config.footer)
                .setTimestamp()

                if(!args[0]){
                  return message.channel.send(choice)
                }

                if (!["add", "remove", "check", "clear"].includes(args[0]))
                    return message.reply(`Please Type The Second Arguments Correctly, \`[add, remove, check, clear]\``)

                if (args[0] === 'add') {
                    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
                    if (!user) return message.channel.send('User not found.')
                    let reason = args.slice(2).join(" ");
                    if (!reason) reason = "Punya Dosa Ga ada Akhlak Sih..";

                    db.findOne({ Guild: message.guild.id, user: user.user.id }, async(err, data) => {
                        if (err) throw err;
                        if (!data) {
                            data = new db({
                                Guild: message.guild.id,
                                user: user.user.id,
                                content: [{
                                    moderator: message.author.id,
                                    reason: reason
                                }]
                            })
                        } else {
                            const obj = {
                                moderator: message.author.id,
                                reason: reason
                            }
                            data.content.push(obj)
                        }
                        data.save()
                    });
                    user.send(new MessageEmbed()
                        .setDescription(`**You have been warned : \`${reason}\`**`)
                        .setColor("RED")
                    )
                    message.channel.send(new MessageEmbed()
                        .setDescription(`**Warned ${user} With : \`${reason}\`**`).setColor('BLUE')
                    )

                    client.modlogs({
                      Member : members,
                      Action : "Warning Member",
                      Color : "RED",
                      Reason : "Give Warning To Member",
                    }, message)

                } else if (args[0] === 'check') {
                    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
                    if (!user) return message.channel.send('User not found.')
                    const reason = args.slice(1).join(" ")


                    db.findOne({ Guild: message.guild.id, user: user.user.id }, async(err, data) => {
                        if (err) throw err;
                        if (data) {
                            const embed = new MessageEmbed()
                                .setTitle(`${user.user.tag}'s warns`)
                                .setDescription(
                                    data.content.map(
                                        (w, i) =>
                                        `**\`${i + 1}\` | Moderator : ${message.guild.members.cache.get(w.moderator).user.username}**\n**Reason : \`${w.reason}\`**`
                                    ).join('\n\n')
                                )
                                .setColor("BLUE")
                            message.channel.send(embed)
                        } else {
                            message.channel.send('User has no data')
                        }

                    })

                    client.modlogs({
                      Member : members,
                      Action : "Check Warning Member",
                      Color : "RED",
                      Reason : "Check Member If Have Warning",
                    }, message)

                } else if (args[0] === 'remove') {
                    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
                    if (!user) return message.channel.send('User not found.')
                    db.findOne({ Guild: message.guild.id, user: user.user.id }, async(err, data) => {
                        if (err) throw err;
                        if (data) {
                            let number = parseInt(args[1]) - 1
                            data.content.splice(number, 1)
                            message.channel.send('deleted the warn')
                            data.save()
                        } else {
                            message.channel.send('This user does not have any warns in this server!')
                        }
                    })

                    client.modlogs({
                      Member : members,
                      Action : "Remove Warning",
                      Color : "RED",
                      Reason : "Remove Warning From Member",
                    }, message)

                } else if (args[0] === 'clear') {
                    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
                    if (!member) return message.channel.send('User not found.')

                    const sentMessage = new MessageEmbed()
                        .setDescription(`**Are You Sure Reset ${member} Warns?\n\n > Please React : ✅ \n > Please React : ❌**`)
                    message.channel.send(sentMessage).then(sentMessage => {
                        sentMessage.react("✅").then(() => sentMessage.react("❌")).then(() => {
                            const filter = (reaction, user) => {
                                return true;
                            }
                            const collector = sentMessage.createReactionCollector(filter);
                            collector.on('collect', async(reaction, user) => {

                                if (reaction.emoji.name === '✅') {
                                    sentMessage.delete()
                                    await db.findOneAndDelete({ user: member.user.id, Guild: message.guild.id })
                                    message.channel.send(`**The Warns ${member} Has Been Reset!**`)
                                }
                                if (reaction.emoji.name === '❌') {
                                    sentMessage.delete()
                                    message.channel.send(`**Okey, The Warn ${member} Is Cancelled To Reset!**`)
                                }


                            })
                        })
                    })

                    client.modlogs({
                      Member : members,
                      Action : "Clear Warning",
                      Color : "RED",
                      Reason : "Clear All Warning From User",
                    }, message)
                }
    }
}