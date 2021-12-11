const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
// const pSchema = require('../../models/prefix')
    // const { prefix } = require('../../token.json')
const { stripIndents } = require("common-tags");
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "prefix",
    aliases: ["setprefix"],
    description: "Setup New Prefix To Use Command",
    category: "administration",
    timeout: 5000,
    usage: "!prefix",
    userPermissions: ["ADMINISTRATOR"],
    botPermissions: ["ADMINISTRATOR"],
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

        const embed = new MessageEmbed()
        .setColor("DARK-BLUE")
        .setDescription(stripIndents `
        **Welcome To \`Prefix\` Command!**
        
        **Please Choose The Option Below**

        <a:icons8dotsloading:896272311542505474> ** Type : \`${p}prefix set <key>\` **
        <a:icons8dotsloading:896272311542505474> ** Type : \`${p}prefix reset\` **
        <a:icons8dotsloading:896272311542505474> ** Type : \`${p}prefix show\` **
        `)
        .setFooter(config.footer)
        .setTimestamp()

        if (!args[0]){
            return message.channel.send(embed)
        }

        if (args[0] === "set") {
            const res = await args.slice(1).join(" ")
            if (!res) return message.channel.send('Please specify a prefix to change to.')
            prefixSchema.findOne({ _id: message.guild.id }, async(err, data) => {
                if (err) throw err;
                if (data) {
                    prefixSchema.findOneAndDelete({ _id: message.guild.id })
                    data = new prefixSchema({
                        _id: message.guild.id,
                        Prefix: res
                    })
                    data.save()
                    message.channel.send(`Your prefix has been updated to **${res}**`)
                } else {
                    data = new prefixSchema({
                        _id: message.guild.id,
                        Prefix: res
                    })
                    data.save()
                    message.channel.send(`Custom prefix in this server is now set to **${res}**`)
                }
            })
        }
        if (args[0] === 'reset') {
            message.channel.send("Really ? Want To Reset ?").then(sentMessage => {
                sentMessage.react("✅").then(() => sentMessage.react("❌")).then(() => {
                    const filter = (reaction, user) => {
                        return true;
                    }
                    const collector = sentMessage.createReactionCollector(filter);
                    collector.on('collect', async(reaction, user) => {
                        if (reaction.emoji.name === '✅') {
                            sentMessage.delete()
                            await prefixSchema.findOneAndDelete({ _id: message.guild.id })
                            message.channel.send(`Done.. The Prefix Has Been Reset To : **${prefix}**`)
                        }
                        if (reaction.emoji.name === '❌') {
                            sentMessage.delete()
                            message.channel.send('Okey Then The Prefix Is Cancelled To Reset.')
                        }

                    })
                })

            })
        } 
        if (args[0] === "show") {
          const { guild, channel } = message
            prefixSchema.findOne({
                _id: guild.id,
                Prefix: res
            }, async(err, data) => {
                if (!data) return message.reply('This Guild Has No Data To Stored')
                message.reply(`This Guild Set Prefix To | ${res}`);


            })
        }

    }
}