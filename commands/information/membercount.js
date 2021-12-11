const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const { stripIndents } = require("common-tags");
const { ReactionPages } = require('reconlx');
const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: "membercount",
    aliases: ["mc"],
    description: "total membercount on server",
    category: "general",
    timeout: 5000,
    usage: "!membercount",
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

      const embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic : true}))
      .setDescription(`**Members Count : \`${message.guild.memberCount}\`**`)
      .setColor(config.blue)
      .setFooter(config.footer)

      message.channel.send(embed)

        
  }
}