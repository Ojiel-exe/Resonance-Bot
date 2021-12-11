const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require("common-tags");
const autoroleusers = require('../../models/guild/autoroleusers')
const autorolebots = require('../../models/guild/autorolebots')

module.exports = {
    name: "autorole",
    aliases: ["autoroles"],
    description: "Setup Auto Role Bots Or Humans",
    category: "administration",
    timeout: 5000,
    usage: "!autorole",
    userPermissions: ["ADMINISTRATOR", "MANAGE_ROLES"],
    botPermissions: ["ADMINISTRATOR", "MANAGE_ROLES"],
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
        **Welcome To \`Auto Roles\` Command!**
        
        **Please Choose The Option Below**

        <a:HC_arrow1:880710912376459285> ** Type : \`${p}autorole [humans | bots] add <nickname>\` **
        <a:HC_arrow1:880710912376459285> ** Type : \`${p}autorole [humans | bots] remove\`**
        <a:HC_arrow1:880710912376459285> ** Type : \`${p}autorole [humans | bots] check\`** 
        <a:HC_arrow1:880710912376459285> ** Type : \`${p}autorole reset\`**
        `)
        .setFooter(config.footer)
        .setTimestamp()

        if(!args[0]){
          return message.channel.send(embed)
        }

        if(!["humans","bots","reset"].includes(args[0])){
          return message.channel.send(`Please Input Second Argument To Use This Commands : \`humans\`, \`bots\``)
        }
        if(args[0] === 'humans'){
          if (!['add', 'remove', 'check'].includes(args[1]))
                return message.reply(`The Seconds Arguments Only Works \`add\`,\`remove\`,\`check\``)
          if (args[1] === 'add') {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
            if (!role) return message.channel.send('That Role Is Not Valid, Please Try Again!')

            autoroleusers.findOne({ _id: message.guild.id }, async(err, data) => {
                if (data)
                    return message.reply(
                        "**This Server/Guild Doesn't Have Auto Role, Please Enable**"
                    )
                new autoroleusers({
                    _id: message.guild.id,
                    Role: role.id,
                }).save();
                message.reply(`**Auto Roles Humans Is Enable!**`)
            })
        }
        if (args[1] === 'remove') {
            await autoroleusers.findOneAndDelete({ _id: message.guild.id })
            message.reply(`**Auto Roles Humans Is Disable!**`)
        }
        if (args[1] === 'check') {
            const { guild } = message
            autoroleusers.findOne({ _id: guild.id }, async(err, data) => {
                if (!data) return message.reply('This Guild/Server Has No Data To Checked')
                if (autoroleusers === false) return message.reply('There Is No AutoRoles Set')

                const role = guild.roles.cache.get(data.Role);
                message.reply(`Auto Roles Humans Set To <@&${role.id}>`)
            })
        }
      } 
      if (args[0] === 'bots'){
        if (!['add', 'remove', 'check'].includes(args[1]))
                return message.reply(`The Seconds Arguments Only Works \`add\`,\`remove\`,\`check\``)
          if (args[1] === 'add') {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
            if (!role) return message.channel.send('That Role Is Not Valid, Please Try Again!')

            autorolebots.findOne({ _id: message.guild.id }, async(err, data) => {
                if (data)
                    return message.reply(
                        "**This Server/Guild Doesn't Have Auto Role, Please Enable**"
                    )
                new autorolebots({
                    _id: message.guild.id,
                    Role: role.id,
                }).save();
                message.reply(`**Auto Roles Bots Is Enable!**`)
            })
        }
        if (args[1] === 'remove') {
            await autorolebots.findOneAndDelete({ _id: message.guild.id })
            message.reply(`**Auto Roles Bots Is Disable!**`)
        }
        if (args[1] === 'check') {
            const { guild } = message
            autorolebots.findOne({ _id: guild.id }, async(err, data) => {
                if (!data) return message.reply('This Guild/Server Has No Data To Checked')
                if (autorolebots === false) return message.reply('There Is No AutoRoles Set')

                const role = guild.roles.cache.get(data.Role);
                message.reply(`Auto Roles Set To <@&${role.id}>`)
            })
        }
      } if(args[0] === "reset"){
        const { guild } = message
            autorolebots.findOne({ _id: guild.id }, async(err, data) => {
                if (data){
                  data.delete()
                }
            })
            autoroleusers.findOne({ _id: guild.id }, async(err, data) => {
                if (data){
                  data.delete()
                }
            })
        message.reply('Done Data All Been Reset')
      }
    }
}