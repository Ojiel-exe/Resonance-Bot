const { MessageEmbed } = require('discord.js')
const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix  = config.prefix
// const id = "313957047202873344"

module.exports.run = async(client, guild) => {
    await prefixSchema.findOne({ _id: guild.id }, async(err, data) => {
        if (err) throw err;
        if (data) {
          console.log(`I Have Been Removed From ${guild.name}`)

          const embed = new MessageEmbed()
          .setTitle(`Bot Removed`)
          .setDescription(`I Can't Check The Information, Because I Been Kicked From ${guild.name}`)
          .setColor(config.red)
          .setTimestamp()
          .setFooter(config.footer)

       guild.channels.cache.get("906342436761128961").send(`Yo, <@596274875820408842> You Got Message Check It Out`,embed) 


            prefixSchema.findOneAndDelete({ _id: guild.id }).then(console.log('deleted data.'))
        }
    })
}