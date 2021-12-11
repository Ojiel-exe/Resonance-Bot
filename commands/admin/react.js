const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const react = require('../../models/cmds/reaction')
const reacttoggle = require('../../models/toggles/reacttoggle')
const { stripIndents } = require("common-tags");
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "react",
    aliases: ["reaction"],
    description: "Setup Command Reaction Like Nadeko",
    category: "administration",
    timeout: 5000,
    usage: "!react",
    userPermissions: ["ADMINISTRATOR"],
    botPermissions: ["ADMINISTRATOR"],
    run: async (client, message, args) => {
        if (message.deletable) message.delete();
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

        await reacttoggle.findOne({ _id : message.guild.id }, async(err, data) => {
            if(!data){
                const ask = new MessageEmbed()
                .setTitle(`React System Is Deactived`)
                .addField(`Oops.., Need To Enable The Reaction Sistem To Use This Command`, `Commands : \`${p}reacttoggle\`` ,false)
                .setColor(config.red)
                .setColor(config.footer)
                return message.channel.send(ask)
            }
            if(data){
              if(data.toggle = true){
                const embed = new MessageEmbed()
                .setColor("DARK-BLUE")
                .setDescription(stripIndents `
                **Welcome To \`Reaction Commands\` Command!**
                
                **Please Choose The Option Below**
        
                <a:HC_arrow1:880710912376459285> ** Type : \`${p}react add <text 1> <text 2>\` **
                <a:HC_arrow1:880710912376459285> ** Type : \`${p}react remove <text 1>\` **
                <a:HC_arrow1:880710912376459285> ** Type : \`${p}react check\` **
                `)
                .setFooter(config.footer)
                .setTimestamp()
        
                if (!args[0]){
                    return message.channel.send(embed)
                }
        
                if (!['add', 'remove', 'check'].includes(args[0]))
                    return message.reply(`The First Arguments Only Works : \`add\`, \`remove\`, \`check\``)
        
                if (args[0] === "add") {
                    const query1 = args[1].toLowerCase() ? args[1].toLowerCase() : "None"
                    // const query2 = args[2].toLowerCase() ? args[2].toLowerCase() : "None"
        
                    if (!query1){
                        return message.reply(`Please Input Specify Name Content`)
                    }
        
                    if (!args.slice(2).join(' ')){
                        return message.reply(`Please Input Specify Second Name Content`)
                    }
        
                    await react.findOne({ Guild: message.guild.id, Content1: query1 }, async (err, data) => {
                        if (err) throw err
                        if (data) {
                            data.Content1 = query1
                            data.Content2 = args.slice(2).join(' ')
                            data.save()
                            message.reply(`Successfully Update Reaction Custom Commands : \`${query1}\``)
        
                        } else if (!data) {
                            let newData = new react({
                                Guild: message.guild.id,
                                Content1: query1,
                                Content2: args.slice(2).join(' ')
                            })
                            newData.save()
                            message.reply(`Successfully Create Reaction Custom Commands : \`${query1}\``)
                        }
                    })
        
                } else if (args[0] === "remove") {
        
                    const query1 = args[1].toLowerCase() ? args[1].toLowerCase() : "None"
                    // const query2 = args[2].toLowerCase() ? args[2].toLowerCase() : "None"
        
                    const data = await react.findOne({ Guild: message.guild.id, Content1: query1 })
                    if (!data)
                        return message.reply(`The Reaction Commands Does Not Exist`)
        
                    await react.findOneAndDelete({ Guild: message.guild.id, Content1: query1 })
                    message.reply(`Succesfully Remove Custome Commands : \`${query1}\``)
        
                } else if (args[0] === "check") {
                    const data = await react.find({ Guild: message.guild.id })
                    if (!data) return message.reply(`The Reaction Commands Does Not Exist`)
        
                    const desc = data.map((commandName, i) =>
                                `**${i + 1}). Command Reaction | \`${commandName.Content1}\`**`
                            )
                            .join('\n\n')
        
                    const embed = new MessageEmbed()
                        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(stripIndents `
                        **(<a:diamond_ausi:863784812174770196>) Display All Reaction Commands**
        
                        ${desc}
                        `)
                        .setColor("RANDOM")
                        .setFooter(config.footer)
                    message.channel.send(embed)
        
                }
              } 
               if(data.toggle = false){
                  const ask = new MessageEmbed()
                  .setTitle(`React System Is Deactived`)
                  .addField(`Oops.., Need To Enable The Reaction Sistem To Use This Command`, `Commands : \`${p}reacttoggle\`` ,false)
                  .setColor(config.red)
                  .setColor(config.footer)
                  return message.channel.send(ask)
              }
            }
        })

    }
}