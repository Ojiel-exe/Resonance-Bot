const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "avatar",
    aliases: ["ava", "pfp", "icon"],
    description: "Check Avatar Users Or Server",
    category: "general",
    // timeout: 5000,
    usage: "!avatar",
    run: async(client, message, args) => {
        let user;

        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0]).user;
        } else {
            user = message.author;
        }

        let avatar = user.displayAvatarURL({ size: 4096, dynamic: true });
        // 4096 is the new biggest size of the avatar.
        // Enabling the dynamic, when the user avatar was animated/GIF, it will result as a GIF format.
        // If it's not animated, it will result as a normal image format.

        const embed = new MessageEmbed()
            .setTitle(`${user.tag} avatar`)
            .setDescription(`[Avatar URL of **${user.tag}**](${avatar})`)
            .setColor(0x1d1d1d)
            .setImage(avatar)

        return message.channel.send(embed);
    }
}