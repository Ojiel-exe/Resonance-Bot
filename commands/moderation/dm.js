const { Client, Message, MessageEmbed } = require('discord.js')
const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const { stripIndents } = require('common-tags')

module.exports = {
    name: "dm",
    aliases: ["pm"],
    description: "DM Members",
    category: "moderation",
    // timeout: 5000,
    usage: "!dm",
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
            let member = message.member;
            if (message.deletable) message.delete({ timeout: 5000 });
            
            let embed = new MessageEmbed()
              .setDescription(stripIndents `
              **📰 What Kind Of Choice You Want To Send Link Description ?**
              **✨ Please Choose The Answer : \`Mention The Members\`**
              
              **🌟 You Have 20 Seconds To Mention Members Or You Will Be DIE**`)
              .setColor(config.blue)
              .setFooter(config.footer)
              .setTimestamp();


              // let xembed = new MessageEmbed()
              // .setDescription(stripIndents`
              // **❌ Invalid Choice Answer, Please Try Again**

              // **🕕 Time's Up, Try Again!**
              // `)
              // .setColor(config.red)
              // .setFooter(config.footer)
              // .setTimestamp()

              const msg = await message.channel.send(embed)
              const filter = m => m.author.id === message.author.id && !m.author.bot
              const collector = await message.channel.createMessageCollector(filter, {
                  max: 3,
                  time: 20000
              })
              collector.on("collect", async collect => {
              const response = collect.content

              let target = collect.mentions.members.first() || message.guild.members.cache.get(response)
              await collect.delete()
              if (!target) {
                  return msg.edit(
                      embed.setDescription(stripIndents `
                    **❌ Invalid Members Mentions, Please Try Again**

                    **🌟 You Have 20 Seconds To Mention The Member Or You Will Be DIE**`
                      )
                  )
              } else {
                  collector.stop(
                    msg.edit(
                          embed.setDescription(stripIndents `
                          **📰 What Message You Want To Send To This ${target} ?**
                          
                          **🌟 You Have 20 Seconds To Send This Message Or You Will Be DIE**`
                          )
                      )
                  );
              }

              const collector2 = await message.channel.createMessageCollector(filter, {
                  max: 3,
                  time: 60000
              });
            collector2.on("collect", async collect2 => {
              const response2 = collect2.content
              await collect2.delete()
              if (!response2) {
                return msg.edit(
                    embed.setDescription(stripIndents `
                    **❌Invalid Message, Please Try Again**

                    **🌟 You Have 60 Seconds To Send The Message Or You Will Be DIE**`
                    )
                );
              } else {
                collector2.stop(
                   msg.edit(
                    embed.setDescription(`**Done.. Sending To ${target}**`)
                     )
                );
                const dm = new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
                .setDescription(stripIndents `
                > **\`From \` : \`${message.author.username}\`**
                
                ${response2}
                `)
                .setColor(config.red)
                target.send(dm).catch(() => {
                  message.channel.send(`**Hello <@${message.author.id}>, I Guess This Person ${target} Has locked DM, How About To Tell Unlock it DM .**`)
                    .then(m => m.delete({ timeout: 10000 }))
                })  
          }
      })
    })
    try{ 
            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                   msg.edit(
                   embed.setDescription(stripIndents`
                  **❌ Invalid Mention Member, Please Try Again**

                  **🕕 Time's Up, Try Again!**
                  `)
                 )
                }
              })
            collector2.on('end', (collected, reason) => {
              if (reason === 'time') {
                  msg.edit(
                   embed.setDescription(stripIndents`
                  **❌ Invalid Message, Please Try Again**

                  **🕕 Time's Up, Try Again!**
                  `)
                 )
              }
            })
    } catch (err) {

    }

         client.modlogs({
            Member : member,
            Action : "DM User",
            Color : "RED",
            Reason : "DM Member",
          }, message)
    }
}