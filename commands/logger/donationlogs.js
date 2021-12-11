const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')
const donation = require('../../models/economy/donation')

module.exports = {
    name: "donationlogs",
    aliases: ["dnlogs","donatelogs"],
    description: "Setup Channel Donation Logs",
    category: "logs",
    // timeout: 5000,
    usage: "!donationlogs",
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
            **Welcome To \`Donatian Owocash Logger Event\` Command!**
            
            **Please Choose The Option Below**

            <a:HC_arrow1:880710912376459285> ** Type : \`${p}donatianlogs set <id | mention channel> <id | mention channel>\` **
            <a:HC_arrow1:880710912376459285> ** Type : \`${p}donatianlogs check\` **
            <a:HC_arrow1:880710912376459285> ** Type : \`${p}donatianlogs remove\` **
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
             const targetChannel1 = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
             const targetChannel2 = message.mentions.channels.last() || message.guild.channels.cache.get(args[2]);

            if(!targetChannel1 || targetChannel2){
              const test = new MessageEmbed()
              .setAuthor(`💲 Setup Donation 💲`)
              .setDescription(`**How To Setup Donation Logs ?...**`)
              .addField(`Detected Donation`, `This For Place Donate Owocash`, false)
              .addField(`Donation Logs`, `This For Logs About Donate Logs Owocash`, false)
              .setFooter(config.footer)
              message.channel.send(test)
            } else {
            await donation.findOneAndUpdate({
                _id: guild.id,
            }, {
                _id: guild.id,
                Channel1: targetChannel1.id,
                Channel2: targetChannel2.id,
            }, {
                upsert: true,
            })
            const done = new MessageEmbed()
            .setAuthor(`💲 Setup Donation 💲`)
            .setDescription(`**✅ | Done, Setup Donation...**`)
            .addField(`Detected Donation`, targetChannel1, false)
            .addField(`Donation Logs`, targetChannel2, false)
            .setFooter(config.footer)
            message.channel.send(done)
            // message.reply(`Logs Donation Set To <#${targetChannel.id}>!`)
          }
        }
        if (args[0] === 'check') {
            const { guild } = message
            await donation.findOne({
                _id: guild.id
            }, async(err, data) => {
                if (!data) {
                const check = new MessageEmbed
                .setAuthor(`💲 Setup Donation 💲`)
                .setDescription(`This Server Has Not Setup Yet`)
                .setFooter(config.footer)
                message.channel.send(check)
                }
                if(data){

                const channel1 = client.channels.cache.get(data.Channel1);
                const channel2 = client.channels.cache.get(data.Channel2);

                const check = new MessageEmbed()
                .setAuthor(`💲 Check Setup Donation 💲`)
                .addField(`Detected Donation`, channel1, false)
                .addField(`Donation Logs`, channel2, false)
                .setFooter(config.footer)
                message.channel.send(check)
                // message.reply(`Donation Check | ${channel}`);
                }
            })
        } 
        if (args[0] === 'remove') {
            const { guild } = message 
						await donation.findOne({ _id: guild.id }, async(err, data) => {
                if(!data){
                   const embed = new MessageEmbed()
                .setAuthor(`💲 Setup Donation 💲`)
                .setDescription(`This Server Has Not Setup Yet`)
                .setFooter(config.footer)
                message.channel.send(embed)
                }
                if(data){
                data.delete()  
                 const embed = new MessageEmbed()
                .setAuthor(`💲 Setup Donation 💲`)
                .setDescription(`Done, The Data Has Been Delete, This Server Has Delete Donation Logs`)
                .setFooter(config.footer)
                message.channel.send(embed)
                }
            })
        }
  }
}