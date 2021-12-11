const Levels = require('discord-xp')
    // const Discord = require('discord.js')
    // const Canvas = require("discord-canvas")
const canvacord = require('canvacord')
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = {
    name: "profile",
    aliases: ["profile"],
    description: "Check Profile Level",
    category: "profile",
    // timeout: 5000,
    usage: "!profile",
    run: async(client, message, args) => {
        if (message.deletable) message.delete({ timeout: 5000 })

        let mentionedMembers = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentionedMembers) mentionedMembers = message.member;

        const target = await Levels.fetch(mentionedMembers.user.id, message.guild.id);
        if (!target) return message.reply(`That Person You Tags, Doesn't Have Any levels`)

        const neededXp = Levels.xpFor(parseInt(target.level) + 1);

        const img = "https://images7.alphacoders.com/109/1092420.jpg"

        const rank = new canvacord.Rank()
        .setAvatar(mentionedMembers.user.displayAvatarURL({format: "png"}))
        .setRank(1, "RANK", false)
        .setBackground("IMAGE", img)
        .setCurrentXP(target.xp)
        .setRequiredXP(neededXp)
        .setCustomStatusColor("#46CED5")
        .setProgressBar("#FFFFFF","COLOR")
        .setUsername(mentionedMembers.user.username)
        .setDiscriminator(mentionedMembers.user.discriminator)
        
        rank.build()
        .then(data =>{
          const attachment = new MessageAttachment(data,"rank-card.png")
          message.channel.send(attachment)
        })

        

    }
}