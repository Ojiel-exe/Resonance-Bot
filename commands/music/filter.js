const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const { MessageEmbed } = require('discord.js')
const prefix = config.prefix

module.exports = {
    name: "filter",
    aliases: ["f"],
    description: "Use Filter To Get Enchanted Music",
    category: "music",
    inVoiceChannel: true,
    timeout: 5000,
    usage: "!filter",
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
        //if (!message.member.voice.channel) return message.reply('Please join a voice channel!');

        //const args = message.content.slice(prefix).trim().split(/ +/g);
        /*const filters = [`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`, `surround`, 'phaser']
        const commandName = args.shift()

        if (filters.includes(commandName)) {
            let filter = client.distube.setFilter(message, commandName);
            message.channel.send("Current queue filter: " + (filter || "Off"));
        }*/
				if (args[0] === "list"){
					const embed = new MessageEmbed()
					.setTitle(`🔊 Filter List`)
					.setDescription(`
					**Hi There 👋**
					My Prefix is \`${p}\`.
					To change filter music type : *\`${p}filter <filter>.\`*
					To turn off the filter type : *\`${p}filter off.\`*
					
					__Filter List Commands__
					\`\`\`yaml\n3D, Bassboost, Echo, Karaoke, Nightcore, Vaporwave, Surround, Phaser\`\`\`
					**For The Notice 👋**
					To change filter music type : *\`${p}filter echo.\`*
					To the filter using *ToLowerCase*, for change the filter or setup to *off*
					`)
					.setColor("RANDOM")
					return message.channel.send(embed)
				}
				const queue = client.distube.getQueue(message)
        if (!queue) {
					return message.channel.send(`❌ | There is nothing in the queue right now!`)
				}
        if (args[0] === "off" && queue.filter) {
					client.distube.setFilter(message, queue.filter)
				} else if (Object.keys(client.distube.filters).includes(args[0])) {
					client.distube.setFilter(message, args[0])
				} else if (args[0]) {
					return message.channel.send(`❌ | Not a valid filter\n🔧 | Type \`${p}filter list\` to check the list`)
				}
        	message.channel.send(`Current Queue Filter: \`${queue.filter || "Off"}\``)
    }
}