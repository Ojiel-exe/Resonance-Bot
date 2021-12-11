const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')
const roleupdates = require('../../models/guild/roleupdates')

module.exports = {
    name: "roleupdate",
    aliases: ["roleupdatelogs"],
    description: "Setup Role Update Logs",
    category: "logs",
    // timeout: 5000,
    usage: "!roleupdate",
    // userPermissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
    // botPermissions: ["ADMINISTRATOR","MANAGE_CHANNELS"],
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

        const choice = new MessageEmbed()
            .setColor("DARK-BLUE")
            .setDescription(stripIndents `
            **Welcome To \`Role Update Logger Event\` Command!**
            
            **Please Choose The Option Below**

            <a:HC_arrow1:880710912376459285> ** Type : \`${p}roleupdate set <id | mention channel>\` **
            <a:HC_arrow1:880710912376459285> ** Type : \`${p}roleupdate check\` **
            <a:HC_arrow1:880710912376459285> ** Type : \`${p}roleupdate remove\` **
            `)
            .setFooter(config.footer)
            .setTimestamp()


          if(!args[0]){
            return message.channel.send(choice)
          }  

        if (!["set", "check", "remove"].includes(args[0]))
            return message.reply(`Please Type The Second Arguments Correctly, \`set\`, \`check\`, \`remove\``)

        if (args[0] === 'set') {
            const { guild, channel } = message
             const targetChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);

            await roleupdates.findOneAndUpdate({
                _id: guild.id,
            }, {
                _id: guild.id,
                Channels: targetChannel.id,
            }, {
                upsert: true,
            })
            message.reply(`Logs Role Update Channel Set To <#${targetChannel.id}>!`)
        }
        if (args[0] === 'check') {
            const { guild } = message
            await roleupdates.findOne({
                _id: guild.id
            }, async(err, data) => {
                if (!data) return message.reply('This Guild Has No Data To Stored')
                const channel = client.channels.cache.get(data.Channels);

                message.reply(`Role Update Logs | ${channel}`);
            })
        }
        if (args[0] === 'remove') {
            const { guild } = message
            await roleupdates.findOne({
                _id: guild.id
            }, async(err, data) => {
                if (data) {
                  data.delete()
                          message.reply(`Done... Data Has Been Deleted`);
                }        
            })
        }
    }
}