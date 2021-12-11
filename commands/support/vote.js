const { Discord, Message, MessageEmbed } = require('discord.js')
const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const { stripIndents } = require('common-tags')

module.exports = {
    name: "vote",
    aliases: [""],
    description: "Making Voting Question",
    category: "support",
    // timeout: 5000,
    usage: "!vote",
    run: async(client, message, args) => {
      let member = message.mentions.users.first() || message.author

    const filter = m => m.author.id == message.author.id;
    

    let embed = new MessageEmbed()
     .setColor("RANDOM")
  	 .setThumbnail('https://media2.giphy.com/media/KzPQHtlTajSTVPRcCz/giphy.gif')
     .setTimestamp()
     .setFooter(member.username, member.avatarURL());

    message.channel.send('**What is the topic that you want to vote for?**');
    try {
      let msg = await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] });
      embed.setTitle(msg.first().content);
    } catch (err) {
      return message.channel.send('You are ran out of time! If you want to do again, please re-run the command.');
    }

    message.channel.send('What is your **first point** to vote for?');
    try {
      let msg = await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] });
      embed.addField(`[🟢] 📝: `, msg.first().content);
    } catch (err) {
        return message.channel.send('You are ran out of time! If you want to do again, please re-run the command.');
    }

    message.channel.send('What is your **second point** to vote for?');
    try {
      let msg = await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] });
      embed.addField(`[🔴] 📝：`, msg.first().content);
    } catch (err) {
        return message.channel.send('You are ran out of time! If you want to do again, please re-run the command.');
    }
    message.channel.send(embed).then(sentMessage => sentMessage.react('🟢')).then(reaction => reaction.message.react('🔴'))

    }
}