const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const { Client, Message, MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')
const Messages = require('../../models/cmds/messagecounter')

module.exports = {
    name: "clear-message",
    aliases: ["message-clear", "clearmessage"],
    description: "Clearing Message, All Members Or One Of Them",
    category: "moderation",
    // timeout: 5000,
    usage: "!clearmessage",
    // userPermissions: ["ADMINISTRATOR","MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    // botPermissions: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    run: async (client, message, args) => {
        if (message.deletable) message.delete({ timeout: 5000 })
        client.prefix = async function (message) {
            let custom;

            const data = await prefixSchema.findOne({ Guild: message.guild.id })
                .catch(err => console.log(err))

            if (data) {
                custom = data.Prefix;
            } else {
                custom = prefix;
            }
            return custom;
        }
        const p = await client.prefix(message)
        let yes = ['yes','y','Y','YES']
        let no = ['no','n','n','NO']
        let embed = new MessageEmbed()
            .setTitle('Message Reset Command')
            .setDescription(stripIndents`
          **🎇 Welcome To Command Reset/Clear Message**

          **📰 How Do I Can Help You ? ${message.author.username}**
          **✨ Please Choose The Answer : \`All\` | \`Member\`**
          
          **🌟 You Have \`20 Seconds\`**`)
            .setColor("RANDOM")
            .setFooter(config.footer)
            .setTimestamp();


        const msg = await message.channel.send(embed)
        const filter = m => m.author.id === message.author.id && !m.author.bot
        const collector = await message.channel.createMessageCollector(filter, {
            max: 3,
            time: 20000
        })
        collector.on("collect", async collect => {
            const response = collect.content.toLowerCase()
            // let choice = [`yes`, `y`, `no`, `n`]
            await collect.delete()
            if (!response) {
                return msg.edit(
                    embed.setDescription(stripIndents`
                    **❌ Invalid Choose Answer, Please Try Again**

                    **✨ Please Choose The Answer : \`All\` | \`Member\`**
                    **🌟 You Have \`20 Seconds\`**`
                    )
                )
            } else {
                collector.stop(
                    msg.edit(
                        embed.setDescription(stripIndents`
                          **📰 Are You Sure You Want To Clear Message ??**
                          **✨ Please Choose The Answer : \`Yes\` | \`No\`**
                          
                          **🌟 You Have 20 Seconds**
                        `)
                    )
                )
            }

            const collector2 = await message.channel.createMessageCollector(filter, {
                max: 3,
                time: 20000
            });

            collector2.on("collect", async collect2 => {
                const response2 = collect2.content.toLowerCase()
                await collect2.delete()
                if (!response2) {
                    return msg.edit(
                        embed.setDescription(stripIndents`
                    **❌ Invalid Choose Answer, Please Try Again**

                    **🌟 \`You Have 20 Seconds\`**`
                        )
                    )
                } else {
                    if (response === "all") {
                        if (yes) {
                          //   await Messages.findOneAnRemove({ Guild: message.guild.id }, async (err, data) => {
                          //       if (data) {
                          //           data.delete()
                          //       } else {
                          //           return
                          //       }
                          // })
                          await Messages.deleteMany({ Guild : message.guild.id})
                          collector2.stop(
                                msg.edit(
                                    embed.setDescription(stripIndents`
                          **🌟 | Done Cleared Messages For \`All\` Users**`
                                    )
                                )
                            )
                        } else if (no) {
                            collector2.stop(
                                msg.edit(
                                    embed.setDescription(stripIndents`
                      **❌ | Cancel Cleared Messages For \`All\` Users**
                      `)
                                )
                            )
                        }
                    } else {
                    collector2.stop(
                       msg.edit(
                              embed.setDescription(stripIndents`
                          **📰 Who You Want To Clear The Message ??**
                          **✨ Please Choose The Answer : \`Mention The Members\`**
                          
                          **🌟 You Have 20 Seconds**
                        `)
                      )
                    )
                  }
                }
              const collector3 = await message.channel.createMessageCollector(filter, {
                max: 3,
                time: 20000
              });

               collector3.on("collect", async collect3 => {
                const member = collect3.mentions.members.first() || collect3.guild.members.cache.get(collect3)
                await collect3.delete()
                if(!member){
                  return msg.edit(
                          embed.setDescription(stripIndents`
                          **❌ Invalid Mention Member, Please Try Again**

                          **🌟 \`You Have 20 Seconds\`**`
                        )
                    )
                } else {
                  if (member) {
                    if (yes) {
                        await Messages.findOne({ Guild: message.guild.id, userID: member.user.id }, async (err, data) => {
                            if (data) {
                                if (data.userID) {
                                    data.delete()
                                } else {
                                    return
                                }
                            } else {
                                return
                            }
                        collector3.stop(
                            msg.edit(
                                embed.setDescription(stripIndents`
                      **🌟 | Done Cleared Messages For **${member}** Users**`
                                )
                            )
                        )
                      })
                    } else if (no) {
                       collector3.stop(
                            msg.edit(
                                embed.setDescription(stripIndents`
                                **❌ | Cancel Cleared Messages For **${member}** Users**`
                                )
                            )
                        )
                      }
                    }
                  }
               })
            })
        })

        try {
            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    msg.edit(
                        embed.setDescription(stripIndents`
                  **🕕 Time's Up, Try Again! | ❌ Invalid Answer**
                      `)
                    )
                }
            })
            collector2.on('end', (collected, reason) => {
                if (reason === 'time') {
                    msg.edit(
                        embed.setDescription(stripIndents`
                   **🕕 Time's Up, Try Again! | ❌ Invalid Answer** 
                  `)
                    )
                }
            });
             collector3.on('end', (collected, reason) => {
                if (reason === 'time') {
                    msg.edit(
                        embed.setDescription(stripIndents`
                   **🕕 Time's Up, Try Again! | ❌ Invalid Answer** 
                  `)
                    )
                }
            });
        } catch (err) {
        }
    }
}