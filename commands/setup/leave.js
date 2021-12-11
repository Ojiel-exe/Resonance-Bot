const leave = require('../../models/guild/leave')
const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const { stripIndents } = require("common-tags");
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "leave",
    aliases: ["set-leave"],
    description: "Setup Leave Channel",
    category: "administration",
    // timeout: 5000,
    usage: "!leave",
    // userPermissions: ["ADMINISTRATOR"],
    // botPermissions: ["ADMINISTRATOR"],
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

        const embed = new MessageEmbed()
        .setColor("DARK-BLUE")
        .setDescription(stripIndents `
        **Welcome To \`Leave Image\` Command!**
        
        **Please Choose The Option Below**

        <a:HC_arrow1:880710912376459285> ** Type : \`${p}leave set <mention | id channel>\` **
        <a:HC_arrow1:880710912376459285> ** Type : \`${p}leave remove <mention | id channel>\` **
        <a:HC_arrow1:880710912376459285> ** Type : \`${p}leave check\` **
        `)
        .setFooter(config.footer)
        .setTimestamp()

        if (!args[0]){
            return message.channel.send(embed)
        }

        if (args[0] === 'set') {
            const { guild } = message

            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if (!channel) return message.reply("Please Mention Channel")


            leave.findOne({ _id: guild.id }, async(err, data) => {
                if (data) {
                    data.channels = channel.id;
                    data.save();
                } else {
                    new leave({
                        _id: guild.id,
                        channels: channel.id,
                    }).save();
                }
                message.reply(`Channel ${channel} Has Been Set As Leave`)
            })
        }
        if (args[0] === 'check') {
            const { guild, channel } = message
            leave.findOne({
                _id: guild.id
            }, async(err, data) => {
                if (!data) return message.reply('This Guild Has No Data To Stored')
                const channel = client.channels.cache.get(data.channels);

                message.reply(`Leave Channel | ${channel}`);


            })
        }
        if (args[0] === "remove") {
            const { guild, channel } = message
            leave.findOneAndDelete({
                _id: guild.id
            }, async(err, data) => {
                if (!data) return message.reply('This Guild Has No Data To Stored')
                message.reply(`Data Has Been Removed`);


            })
        }
         if (args[0].toLowerCase() === "test") {
            client.emit('guildMemberRemove', message.member);
        }

    }
}