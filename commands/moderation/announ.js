const { Client, Message, MessageEmbed } = require('discord.js')
const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const { stripIndents } = require('common-tags')
const prefix = config.prefix

module.exports = {
    name: "announ",
    aliases: ["announcement"],
    description: "Making Announcement",
    category: "moderation",
    // timeout: 5000,
    usage: "!announ",
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
            if (message.deletable) message.delete();

            const choice = new MessageEmbed()
            .setColor("DARK-BLUE")
            .setDescription(stripIndents `
            **Welcome To \`Announcement Server\` Command!**
            
            **Please Choose The Option Below**

           <a:HC_arrow1:880710912376459285> ** Type : \`${p}announcement [message]\` **
            `)
            .setFooter(config.footer)
            .setTimestamp()

            if(!args[0]){
              return message.channel.send(choice)
            }

            let text = args.join(" ")
            if (!text) return message.reply('**Please Input The Word To Make Announcement**')

              let ask = new MessageEmbed()
            .setColor("DARK-BLUE")
            .setDescription(stripIndents `            
            **Please Choose The Option Below**

           <a:HC_arrow1:880710912376459285> ** Choose 1️⃣ To Send Message Announcement Without Embed **
           <a:HC_arrow1:880710912376459285> ** Choose 2️⃣ To Send Message Announcement With Embed**
            `)
            .setFooter(config.footer)
            .setTimestamp()

        let msg = await message.channel.send(ask)
        await msg.react('1️⃣');
        await msg.react('2️⃣');
        const filter = (reaction, user) => user.id === message.author.id; //user.id !== message.client.user.id
        const collector = msg.createReactionCollector(filter, { time: 25000 });

        let withembed = new MessageEmbed()
        .setDescription(text)
        .setColor(config.red)
        .setFooter(config.footer)

        collector.on('collect', (reaction, user) => {
            switch (reaction.emoji.name) {
                case "1️⃣":
                      msg.delete()
                      message.channel.send(text)                    
                    break;
                case "2️⃣":
                      msg.delete()
                      message.channel.send(withembed)
                    break;
                      }
                  })

      client.modlogs({
        Member : member,
        Action : "Announcement",
        Color : "RED",
        Reason : text
      }, message)
    }
}