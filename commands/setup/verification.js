const prefixSchema = require('../../models/cmds/prefix')
const verification = require('../../models/guild/verification')
const verifytoggle = require('../../models/toggles/verifytoggle')
const config = require('../../config.json')
const prefix = config.prefix
const { stripIndents } = require("common-tags");
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "verification",
    aliases: ["verification"],
    description: "Create Verification Channel",
    category: "administration",
    // timeout: 5000,
    usage: "!verification",
    userPermissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
    botPermissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
    run: async (client, message, args) => {

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
                        .addField(`Opps.., Need To Enable The Verification Sistem To Use This Command`, `Commands : \`${p}verifytoggle\`` ,false)
                        .setColor(config.red)
                        .setFooter(config.footer)
                    return message.channel.send(ask)
            }
            if(data){
              if (data.toggle = true) {
                const embed = new MessageEmbed()
                    .setColor("DARK-BLUE")
                    .setDescription(stripIndents`
        **Welcome To \`Verification Commands\` Command!**
        
        **Please Choose The Option Below**

        <a:HC_arrow1:880710912376459285> ** Type : \`${p}verification set <verification channel> <notice channel> <role>\` **
        <a:HC_arrow1:880710912376459285> ** Type : \`${p}verification remove\` **
        <a:HC_arrow1:880710912376459285> ** Type : \`${p}verification check\` **
        `)
                    .setFooter(config.footer)
                    .setTimestamp()

                if (!args[0]) {
                    return message.channel.send(embed)
                }

                // if (!['set', 'remove'].includes(args[0]))
                //     return message.reply(`The First Arguments Only Works ${choice}`)

                if (args[0] === 'set') {
                    const { guild } = message
                    await verification.findOne({ _id: guild.id }, async (err, data) => {
                        if (err) throw err
                        if (data) return message.reply("This Setup Already Set, Please Remove First")

                        if (!args[1])
                            return message.channel.send("**Please Enter A Channel Name Where The User Should Be Asked To Verify!**");
                        if (!args[2])
                            return message.channel.send("**Please Enter A Channel To Notice If Done Verify!**");
                        if (!args[3])
                            return message.channel.send("**Please Enter A Role Which Will Be Added After The User Is Verified!**");


                        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args[1].toLocaleLowerCase());
                        if (!channel || channel.type !== 'text') {
                            return message.channel.send("**Please Enter A Valid Channel To Set Verification!**");
                        }

                        let notice = message.mentions.channels.last() || message.guild.channels.cache.get(args[2]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args[2].toLocaleLowerCase());
                        if (!notice || notice.type !== 'text') {
                            return message.channel.send("**Please Enter A Valid Channel To Set Notice Verify!**");
                        }

                        let role = message.guild.roles.cache.find(r => (r.name === args[3].toString()) || (r.id === args[3].toString().replace(/[^\w\s]/gi, '')));
                        if (!role) {
                            return message.reply("Please Enter Valid Role")
                        }

                        let verifiedchannel = channel;
                        try {

                            if (channel.id === channel && role.id === role) {
                                return message.reply("The Verification Channels Has Been Set Up Already!!")
                            } else if (channel.id === channel && role.id === role) {
                                return message.reply("The Role Verification Channels Has Been Set Up Already!!")
                            } else {
                                message.guild.channels.cache.forEach(channel => {
                                    if (channel.type === 'category' && channel.id === verifiedchannel.id) return;
                                    let r = channel.permissionOverwrites.get(role.id);
                                    if (!r) return;
                                    if (r.deny.has("VIEW_CHANNEL") || r.deny.has("SEND_MESSAGES")) return;

                                    channel.createOverwrite(guild.id, {
                                        VIEW_CHANNEL: false
                                    });

                                    channel.updateOverwrite(role, {
                                        VIEW_CHANNEL: true,
                                        SEND_MESSAGES: true
                                    });
                                });

                                verifiedchannel.updateOverwrite(role, {
                                    SEND_MESSAGES: false,
                                    VIEW_CHANNEL: false
                                });
                            }
                            const embed = new MessageEmbed()
                                .setTitle(`${message.guild.name}`)
                                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                .setColor("GREEN")
                                //.addField
                                .setDescription(stripIndents`
                    **__(<a:BSG_NoteDiamond:819061083414200321>) Notification Verification__**
                    
            **• <:723792916866400356:860389791657230346> Welcome To \`${message.guild.name}\` Please Type The Commands Down Belows**
            
            \`\`\`${p}verify\`\`\`
            **• <:723792916866400356:860389791657230346> After Type The Command To Received Roles : ${role}**
            `)
                                .setFooter(`${message.guild.name} - ${client.user.username}`, message.guild.iconURL())
                                .setTimestamp(new Date())


                            let channelss = client.guilds.cache.get(guild.id).channels.cache.get(channel.id)
                            let msg = await channelss.send(embed)

                            Promise.all([
                                msg.react("<:icons8t50:860389791212503091>"),
                                msg.react("<:icons8h50:860389791593660416>"),
                                msg.react("<:icons8a50:860389791555518494>"),
                                msg.react("<:__:860389791480152102>"),
                                msg.react("<:icons8k50:860389791412650044>"),
                                msg.react("<:icons8s50:860389791615156234>"),
                            ])

                            new verification({
                                _id: guild.id,
                                Channels: channel.id,
                                Channel: notice.id,
                                messageID: msg.id,
                                role: role.id
                            }).save()



                            message.reply(`**Verification Channel And Role Has Been Set Successfully in \`${channel.name}\`!**`)

                        } catch (e) {
                            return message.channel.send(`**${e.message}**`)
                        }

                    })

                }
                if (args[0] === 'remove') {
                    const { guild } = message
                    const m = await message.channel.send("**Please Wait... For `2 Seconds`**")

                    verification.findOne({ _id: guild.id }, async (err, data) => {
                        //const channelss = message.guild.channels.cache.get(data.channels)
                        if (!data) {
                            console.log('Cannot Delete, Cuz Not In The Database')
                            return message.reply('**This Server/Guild Doesnt Have MemberCounter, Please Enable First**')

                        }
                        if (data) {
                            setTimeout(function () {
                                data.delete()
                                // const textChannel = message.guild.channels.cache.get(data.Channels)
                                // const msgID = textChannel.messages.fetch(data.messageID)
                                // client.channels.cache.get(data.Channels).messages.fetch(data.messageID).then(message => message.delete())
                                // data.delete()
                                // msgID.delete()

                                //channelss.delete()
                                m.edit(`**<@${message.author.id}>, Done ✅ | Verification Channels Is Successfully Remove/Disable**`)
                            }, 2000)
                        } else {
                            setTimeout(function () {
                                data.delete()
                                m.edit(`**<@${message.author.id}>, Done ✅ | Verification Channels Is Successfully Remove/Disable**`)
                            }, 2000)
                        }
                    })

                }
                if (args[0] === 'check') {
                    const { guild } = message
                    const m = await message.channel.send("**Please Wait... For `2 Seconds`**")

                    verification.findOne({ _id: guild.id }, async (err, data) => {
                        //const channelss = message.guild.channels.cache.get(data.channels)
                        if (!data) {
                            setTimeout(function () {
                                //channelss.delete()
                                m.edit(`**<@${message.author.id}>, :x: | This Guild Has No Data To Stored**`)
                            }, 2000)
                        } else {
                            const channel = client.channels.cache.get(data.Channels);
                            setTimeout(function () {
                                //channelss.delete()
                                m.edit(`**<@${message.author.id}>, ✅ | Check Verification Channels Is <#${channel.id}>`)
                            }, 2000)
                        }

                    })

                }
              } 
               if (data.toggle = false) {
                    const ask = new MessageEmbed()
                        .setTitle(`AFK System Is Deactived`)
                        .addField(`Opps.., Need To Enable The Verification Sistem To Use This Command`, `Commands : \`${p}verifytoggle\`` ,false)
                        .setColor(config.red)
                        .setFooter(config.footer)
                    return message.channel.send(ask)
              }
            }
        })
    }
}