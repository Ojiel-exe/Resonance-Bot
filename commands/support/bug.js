const { MessageEmbed } = require("discord.js");
const { stripIndents } = require('common-tags')
const config = require('../../config.json')
const prefix = config.prefix

module.exports = {
    name: "bug",
    aliases: ["bug-report"],
    description: "Report To The Developer If The Bot Got Bug Commands",
    category: "support",
    // timeout: 5000,
    usage: "!bug",
    // userPermissions: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    // botPermissions: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    run: async(client, message, args) => {
      if(message.deletable) message.delete()
      let reason = args.join(' ')
      if(!reason){
        return message.reply('Please Input The Reason Why You Need To Report')
      }
        const embed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(stripIndents `
            **__(<:RG_ServerIcon:912880402488762399>) Report Bug__**

> **• \`Reported By\` | \`${message.author.username}\`**
> **• \`From Server\` | \`${message.guild.name}\`**
> **• \`Time\` | \`${message.createdAt.toLocaleString()}\`** 
> **• \`Message\` | \`${reason}\`**
            `)
            .setColor("#f49542")

        message.channel.send(`
    **Thank You <@${message.author.id}> For Reported Bug To Official Server 
        Stand By The Message Will Be Previewed.**`)
        client.users.cache.get("313957047202873344").send(embed).then(i => i.react("⏳"))
    }
}