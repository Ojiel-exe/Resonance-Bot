const captcha = require('../../models/guild/captcha')
const captchatoggle = require('../../models/toggles/captchatoggle')
const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const { stripIndents } = require("common-tags");
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "captcha",
    aliases: ["set-captcha"],
    description: "Setup Captcha Verification",
    category: "administration",
    // timeout: 5000,
    usage: "!captcha",
    userPermissions: ["ADMINISTRATOR"],
    botPermissions: ["ADMINISTRATOR"],
    run: async(client, message, args) => {
      if(message.deletable) message.delete()
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

        await captchatoggle.findOne({ _id : message.guild.id }, async(err, data) =>{
          if(!data){
            const ask = new MessageEmbed()
                  .setTitle(`Captcha System Is Deactived`)
                  .addField(`Opps.., Need To Enable The Badword Sistem To Use This Command`, `Commands : \`${p}captchatoggle\`` ,false)
                  .setColor(config.red)
                  .setFooter(config.footer)
              return message.channel.send(ask)

          }
          if(data){
            if(data.toggle = true){
              let embed = new MessageEmbed()
            .setTitle('Setup Captcha Verification') 
            .setDescription(stripIndents`
             **📰 What Choice You Want To Use ?, To Sestup Captcha ?**
            **✨ Please Choose The Answer : \`Set\` | \`Remove\` | \`Check\`**
            
            **🌟 You Have \`30 Seconds\` **`)
            .setColor("RANDOM")
            .setFooter(config.footer)
            .setTimestamp();

        
        const msg = await message.channel.send(`<@${message.author.id}>`, embed)
        const filter = m => m.author.id === message.author.id && !m.author.bot
        const collector = await message.channel.createMessageCollector(filter, {
            max: 2,
            time: 30000,
            
        })
         collector.on("collect", async collect => {
            const response = collect.content.toLowerCase()
            await collect.delete()
            if(!response){
                return msg.edit(
                    embed.setDescription(stripIndents`
                    **❌ Invalid Choose Answer, Please Try Again**

                    **✨ Please Choose The Answer : \`Set\` | \`Remove\` | \`Check\`**
                    **🌟 You Have 30 Seconds To Answer Or It Will Be Stop**
                  `)
                )
              } else {
                collector.stop(
                   msg.edit(
                        embed.setDescription(stripIndents`
                          **📰 What Role You Want To Setup ?**
                          
                          **✨ Please Choose The Answer : \`Mention The Role\`**
                          **🌟 You Have 30 Seconds To Answer Or It Will Be Stop**`
                        )
                    )
                )
              }
            const collector2 = await message.channel.createMessageCollector(filter, {
            max: 3,
            time: 30000
            });

             collector2.on("collect", async collect2 => {
                const response2 = collect.mentions.roles.first() || collect.guilds.roles.cache.get(args[1])
                await collect2.delete()
                if (!response2) {
                    return msg.edit(
                        embed.setDescription(stripIndents`
                    **❌ Invalid Choose Answer, Please Try Again**

                    **✨ Please Choose The Answer : \`Please Mention The Role\`**
                    **🌟 You Have 30 Seconds To Answer Or It Will Be Stop**`
                        )
                    )
                } else {
                  collector2.stop()
                  if(response === "set"){
                    await captcha.findOne({ _id : message.guild.id }, async(err, data) => {
                      if(!data){
                        new captcha({
                          _id : message.guild.id,
                          Role : response2
                        }).save()
                        return msg.edit(
                            embed.setDescription(stripIndents`
                            **✅ Done Setup Captcha, With Role : ${Role}**
                          `)
                        )
                      }
                      if(data){
                         return msg.edit(
                            embed.setDescription(stripIndents`
                            **✅This Server Already Setup Captcha**
                          `)
                        )
                      }
                    })
                  }
                  if(response === "remove"){
                     await captcha.findOne({ _id : message.guild.id }, async(err, data) => {
                      if(!data){
                         return msg.edit(
                            embed.setDescription(stripIndents`
                            **❌ This Server Doesn't Setup Captcha**
                          `)
                        )
                      }
                      if(data){
                        data.delete()
                         return msg.edit(
                            embed.setDescription(stripIndents`
                            **✅ Done Delete Setup Captcha**
                          `)
                        )
                      }
                    })
                  }
                  if(response === "check"){
                     await captcha.findOne({ _id : message.guild.id }, async(err, data) => {
                      if(!data){
                        return msg.edit(
                            embed.setDescription(stripIndents`
                            **❌ This Server Doesn't Setup Captcha**
                          `)
                        )
                      }
                      if(data){
                        const role = collect2.guild.roles.cache.get(data.Role)
                        return msg.edit(
                            embed.setDescription(stripIndents`
                            **🎊 This Captcha Setup To Role : ${role}**
                          `)
                        )
                      }
                    })
                  }
                }
              })
            })
            try {
                collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    msg.edit(
                        embed.setDescription(stripIndents`
                    **❌ Invalid Answer**

                    **🕕 Time's Up, Try Again!**
                        `)
                    )
                }
              })
              collector2.on('end', (collected, reason) => {
                if (reason2 === 'time') {
                    msg.edit(
                        embed.setDescription(stripIndents`
                    **❌ Invalid Answer**

                    **🕕 Time's Up, Try Again!**
                        `)
                    )
                }
              })      
              } catch (e) {

              }
            }
             if(data.toggle = false){
                const ask = new MessageEmbed()
                  .setTitle(`Captcha System Is Deactived`)
                  .addField(`Opps.., Need To Enable The Badword Sistem To Use This Command`, `Commands : \`${p}captchatoggle\`` ,false)
                  .setColor(config.red)
                  .setFooter(config.footer)
              return message.channel.send(ask)
            }
          }
        })
    }
}