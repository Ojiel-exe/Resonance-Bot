const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "ping",
    aliases: ["latency"],
    description: "check on user ping",
    category: "general",
    // timeout: 5000,
    usage: "!ping",
    run: async(client, message, args) => {
        const msg = await message.channel.send("🏓 Pinging....");
        const Embed = new MessageEmbed()
            .setTitle("Ping!")
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
            .addField('⌛ Latency', `${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`)
            .addField('⏲️ API Latency', `${Math.round(client.ws.ping)}ms`)
            .setColor('RANDOM');
        msg.edit(Embed);
        //msg.edit("\u200b");
    }
}