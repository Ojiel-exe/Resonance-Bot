const { Client, Message, MessageEmbed } = require('discord.js')
const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const { stripIndents } = require('common-tags')

module.exports = {
    name: "generate-invite",
    aliases: ["gi","generate","generateinvite"],
    description: "Generates an invite link of the current text channel of your Discord server.",
    category: "support",
    // timeout: 5000,
    usage: "!generate-invite",
    run: async(client, message, args) => {
        let uses = args[0]
        let age = args[1]

        let invite = await message.channel.createInvite({
          maxAge: age * 60,
          maxUses: uses 
        });
        const embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic : true }))
        .setDescription(stripIndents `
        **[:flag_us:] English**
        **If You Wanna Invite Friends To This Server, Share The Following Invite**
        **Links With Your Friends** : \`https://discord.gg/${invite.code}\`

        **[:flag_mc:] Indonesia**
        **Jika Kamu Ingin Mengundang Teman Ke Server Ini, Share Undangan Berikut**
        **Links Dengan Teman Anda** : \`https://discord.gg/${invite.code}\`
        `)
        .setColor("RANDOM")
        .setFooter(config.footer + `${message.guild.name}`)
        return message.channel.send(embed)
        // await message.channel.send('Hiya.\n'
        //   + 'If you wanna invite friends to this server, share the following invite'
        //   + ' link with your friends.\n<3\n' +
        //   `https://discord.gg/${invite.code}`)
    }
}