const { MessageEmbed } = require('discord.js')
const os = require('os')

module.exports = {
    name: "bot",
    aliases: ["botinfo", "bi"],
    description: "Check Information On Bots",
    category: "information",
    timeout: 5000,
    usage: "!bot",
    run: async(client, message, args) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle('Bot Stats')
            .setColor('#000000')
            .addFields({
                name: '📄 Name',
                value: ` ${client.user.username} .`,
                inline: true
            }, {
                name: '👔 Bot Developer',
                value: ` <@596274875820408842> .`,
                inline: true
            }, {
                name: '🌐 Servers',
                value: `Serving ${client.guilds.cache.size} servers.`,
                inline: true
            }, {
                name: '📺 Channels',
                value: `Serving ${client.channels.cache.size} channels.`,
                inline: true
            }, {
                name: '👥 Server Users',
                value: `Serving ${client.users.cache.size}`,
                inline: true
            }, {
                name: '⏳ Ping',
                value: `${Math.round(client.ws.ping)}ms`,
                inline: true
            }, {
                name: '📆 Creation Date: ',
                value: user.user.createdAt.toLocaleDateString("en-us"),
                inline: true
            }, {
                name: '✅ Joined Date: ',
                value: user.joinedAt.toLocaleDateString("en-us"),
                inline: true
            }, {
                name: '🌀 Cores CPU',
                value: `Cores: ${os.cpus().length}`,
                inline: true
            })
            .setFooter(`Created By: ${message.author.tag}`, message.author.displayAvatarURL())

        await message.channel.send(embed)
    }
}