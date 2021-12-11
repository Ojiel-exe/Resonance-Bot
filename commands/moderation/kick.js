const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "kick",
    aliases: ["kicked"],
    description: "kick",
    category: "moderation",
    // timeout: 5000,
    usage: "!kick",
    // userPermissions: ["kick_MEMBERS"],
    // botPermissions: ["kick_MEMBERS"],
    run: async (client, message, args) => {
        if (message.deletable) message.delete();
        if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send('You can\'t use that!')
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.channel.send('I don\'t have the right permissions.')

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!args[0]) return message.channel.send('Please specify a user');

        if (!member) return message.channel.send('Can\'t seem to find this user. Sorry \'bout that :/');
        if (!member.kickable) return message.channel.send('This user can\'t be kicked. It is either because they are a mod/admin, or their highest role is higher than mine');

        if (member.id === message.author.id) return message.channel.send('Bruh, you can\'t kick yourself!');

        let reason = args.slice(1).join(" ");

        if (reason === undefined) reason = 'Unspecified';

        member.kick(reason)
            .catch(err => {
                if (err) return message.channel.send('***> Something went wrong <***')
            })

        const embed = new MessageEmbed()
            .setTitle("Member's kickned's")
            .setColor("RANDOM")
            .setTimestamp()
            .addField("General", [
                `**❯ User kicked:**, ${member}`,
                `**❯ kicked by:**, ${message.author}`,
                `**❯ reason:**, ${reason}`
            ])

        message.channel.send(embed);
    }
}