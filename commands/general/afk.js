// const HKUtilites = require('hkutilities')
const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const { stripIndents } = require("common-tags");
const { MessageEmbed } = require('discord.js')
const afk = require('../../models/cmds/afk')
// const { afk } = require('../../Collection')
const afktoggle = require('../../models/toggles/afktoggle')

module.exports = {
    name: "afk",
    aliases: ["afk"],
    description: "Setup AFk",
    category: "general",
    // timeout: 5000,
    usage: "!afk",
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

        await afktoggle.findOne({ _id : message.guild.id }, async(err, data) => {
            if(!data){
                const ask = new MessageEmbed()
                .setTitle(`AFK System Is Deactived`)
                .addField(`Oops.., Need To Enable The AFK Sistem To Use This Command`, `Commands : \`${p}afktoggle\`` ,false)
                .setColor(config.red)
                .setColor(config.footer)
                return message.channel.send(ask)
            }
            if(data){
              if(data.toggle = true){
                let data;
                  try{
                      data = await afk.findOne({
                      User : message.author.id,
                      Guild : message.guild.id
                      })

                    if(!data){
                        data = await afk.create({
                        User : message.author.id,
                        Guild : message.guild.id
                    })
                  }
                } catch (e) {
                  message.channel.send(`ERROR 404 : ${e.message}`)
                  .then(m => m.delete({ timeout : 5000 }))
                }
                let reason = args.join(' ')
                message.channel.send(`<@${message.author.id}>,  I set your AFK : ${reason}`)
                data.AFK = true
                data.Reason = reason
                await data.save()
              } 
               if(data.toggle = false){
                const ask = new MessageEmbed()
                .setTitle(`AFK System Is Deactived`)
                .addField(`Oops.., Need To Enable The AFK Sistem To Use This Command`, `Commands : \`${p}afktoggle\`` ,false)
                .setColor(config.red)
                .setColor(config.footer)
                return message.channel.send(ask)
              }
            }
        })
    }
}