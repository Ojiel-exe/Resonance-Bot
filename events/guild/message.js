const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const { Client, Collection, MessageEmbed } = require('discord.js')
const { MessageButton, MessageActionRow } = require("discord-buttons")

module.exports.run = async (client, message) => {
    if(message.author.bot) {
        return
    }
    
        if (message.channel.type === 'dm') {

            var lami = message.content.split(" ").slice(0)
                            var lami = lami.slice(0).join(" ")
                            if (message.author.bot) {
                                    return;
                            }
                    // const guild = message.guild.cache.get(data._id)
                            const Embed = new MessageEmbed()
                            .setAuthor("Feedback / Bug",`${message.author.displayAvatarURL({ dynamic : true })}`)
                            .setDescription(lami)
                            .setFooter(message.author.tag)
                            .setTimestamp()
                            .setColor("BLACK")
                     client.guilds.cache.get("896272311542505474").channels.cache.get("918429860391690240").send(Embed)
                    

            if (message.content.startsWith(prefix)) {
                let invite = new MessageButton()
                    .setStyle("url")
                    .setLabel("Invite Me")
                    .setURL("https://discord.com/oauth2/authorize?client_id=913689331699417098&scope=bot&permissions=699473587455")
    
                let server = new MessageButton()
                    .setStyle("url")
                    .setLabel("Support Server")
                    .setURL("https://discord.gg/PjN5DtskXz")
    
                let website = new MessageButton()
                    .setStyle("url")
                    .setLabel("Website")
                    .setURL("https://linktr.ee/Ojiel.exe")
    
                let row = new MessageActionRow()
                    .addComponents(instagram)
                    .addComponents(invite)
                    .addComponents(server)
                    .addComponents(website)
    
                return message.channel.send(":x: | To use command with prefix please go to my real server, down below", {
                    components: [row]
                });
            }
    
            if (message.content.startsWith("help")) {
                const embed = new MessageEmbed()
                    .setAuthor(client.user.username + " Command List", client.user.displayAvatarURL({ dynamic: true }))
                    .setThumbnail(client.user.displayAvatarURL())
                    .setDescription(`
                **Hi There 👋**
                To see list command, Type \`help <categories>\`
                To see info for that command, Type \`help <command>\`
    
                __Categories List Commands__ 
                            \`\`\`yaml\nAdministration, General, Economy, Fun, Information, Invites, Leaderboard, Giveaway, Music, Moderation, Logger, Utility, Youtube, Owner, Premium, Support, Server, Setup, Toggle\`\`\`
                *If need help, you can join our server by click our button donw below, or type \`<message>\`*.
                `)
                    .addFields(categories)
                    .setColor("RED")
                    .setTimestamp()
                    .setFooter(config.footer + `Total Commands - ${client.commands.size - 1}`)
                    .setTimestamp()
    
                let instagram = new MessageButton()
                    .setStyle("url")
                    .setLabel("Follow Us")
                    .setURL(`https://www.instagram.com/restgangs.id/`)
    
                let invite = new MessageButton()
                    .setStyle("url")
                    .setLabel("Invite Me")
                    .setURL("https://discord.com/oauth2/authorize?client_id=913689331699417098&scope=bot&permissions=699473587455")
    
                let server = new MessageButton()
                    .setStyle("url")
                    .setLabel("Support Server")
                    .setURL("https://discord.gg/PjN5DtskXz")
    
                let website = new MessageButton()
                    .setStyle("url")
                    .setLabel("Website")
                    .setURL("https://linktr.ee/Ojiel.exe")
    
                let row = new MessageActionRow()
                    .addComponents(instagram)
                    .addComponents(invite)
                    .addComponents(server)
                    .addComponents(website)
    
                return message.channel.send({
                    embed: embed,
                    components: [row]
                });
                    }
    }
    
    if(!message.guild) {
        return
    }
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

    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);

    if (message.content.match(prefixMention)) {
        const embed = new MessageEmbed()
            .setTitle(`Hi, I\'m ${client.user.username}. Need help?`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`You Can Type \`${p}help\` To See All Commands.`)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(config.blue)
            .setFooter(config.footer)
        let invite = new MessageButton()
            .setStyle("url")
            .setLabel(`Invite ${client.user.username}`)
            .setURL(`https://discord.com/oauth2/authorize?client_id=913689331699417098&scope=bot&permissions=700077571327`)

        let support = new MessageButton()
            .setStyle("url")
            .setLabel(`Support ${client.user.username}`)
            .setURL(`https://discord.gg/PjN5DtskXz`)

        let row = new MessageActionRow()
            .addComponents(invite)
            .addComponents(support)

        message.channel.send(`Hello <@${message.author.id}>`, {
            embed: embed,
            components: [row]
        })
    }

    if(!message.content.startsWith(p)){
        return
    }

    if (!message.member) message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(p.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    if (commandName.length === 0) return;

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if(command){
        command.run(client, message, args)
}}