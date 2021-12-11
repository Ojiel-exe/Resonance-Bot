const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix
const footer = config.footer
const { stripIndents } = require(`common-tags`);
const { MessageEmbed } = require('discord.js')

//admin
const ads = require('../../models/anti/ads')
const scam = require('../../models/anti/scam')
const autoroleusers = require('../../models/guild/autoroleusers')
const autorolebots = require('../../models/guild/autorolebots')
const altdetect = require('../../models/anti/altdetect')
const badword = require('../../models/cmds/blacklist-word')
const caps = require('../../models/anti/caps')
const chatBot = require('../../models/cmds/chatBot')
const react = require('../../models/cmds/reaction')
const verification = require('../../models/guild/verification')
const membercounter = require('../../models/guild/membercounter')
const welcome = require('../../models/guild/welcome')
const leveltoggle = require('../../models/toggles/leveltoggle')
const leave = require('../../models/guild/leave')

//logger
const altdetectlogs = require('../../models/guild/altdetectlogs')
const alllogs = require('../../models/guild/alllogs')
const boostlogs = require('../../models/guild/channelcreates')
const channelcreate = require('../../models/guild/channelcreates')
const channeldelete = require('../../models/guild/channeldeletes')
const channelupdate = require('../../models/guild/channelupdates')
const ghostPingSchema = require('../../models/guild/ghostping')
const guildmemberupdates = require('../../models/guild/guildmemberupdates')
const guildupdates = require('../../models/guild/guildupdates')
const modlogs = require('../../models/guild/modlogs')
const invitelogs = require('../../models/guild/invitelogs')
const messagedelete = require('../../models/guild/messagedeletes')
const messageupdate = require('../../models/guild/messageupdates')
const rolecreate = require('../../models/guild/rolecreates')
const roledelete = require('../../models/guild/roledeletes')
const roleupdate = require('../../models/guild/roleupdates')
const voicestate = require('../../models/guild/voicestates')
const memberlogs = require('../../models/guild/member-logs')
const levellogs = require('../../models/guild/levellogs')

module.exports = {
    name: 'settings',
    aliases: ['settings'],
    description: 'Check Setup Settings Logs + Admin',
    category: 'administration',
    timeout: 5000,
    usage: '!settings',
    userPermissions: ["ADMINISTRATOR"],
    botPermissions: ["ADMINISTRATOR"],
    run: async(client, message, args) => {
        if(message.deletable) message.delete({timeout : 4000})
        client.prefix = async function (message) {
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
   
        const NoChoice = new MessageEmbed()
        .setTitle('Configuration(s) System')
        .setDescription(`**For More information\nPlease Type \`${p}settings [category]\`**`)
        .addField('Admin', '`14` admin', true)
        .addField('Logs', '`20` logs', true)
        .setTimestamp()
        .setColor(config.blue)
        .setFooter(config.footer);

        if (!args[0]) {
          return message.channel.send(NoChoice)
          }

          switch (args[0].toLowerCase()) {
            case 'admin':
              const Admin = new MessageEmbed()
                .setTitle('System **`Administration`** Configuration(s)')
                .setDescription('This Is Configuration System \`Administration\`\nIf Green Means Enable Or Actived\nIf Red Means Disable Or Not Actived')
                .setColor(config.blue)
                .setFooter(config.footer);
                //Admin
                await ads.findOne({ _id : message.guild.id }, async(err, data) => {
                  if(data){
                    Admin.addField('Anti Invite Settings', `\`🟢 (ON)\`` , true)
                  } 
                  if(!data) {
                    Admin.addField('Anti Invite Settings', `\`🔴 (OFF)\`` , true)
                  }
                })
                await scam.findOne({ _id : message.guild.id }, async(err, data) => {
                  if(data){
                    Admin.addField('Anti Scam Settings', `\`🟢 (ON)\`` , true)
                  } 
                  if(!data) {
                    Admin.addField('Anti Scam Settings', `\`🔴 (OFF)\`` , true)
                  }
                })
                await autoroleusers.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Admin.addField('Auto Role Users Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Admin.addField('Auto Role Users Settings', `\`🔴 (OFF)\``, true)
                  }
                })
                await autorolebots.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Admin.addField('Auto Role Bots Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Admin.addField('Auto Role Bots Settings', `\`🔴 (OFF)\``, true)
                  }
                })
                await altdetect.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Admin.addField('Alt Detection Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Admin.addField('Alt Detection Settings', `\`🔴 (OFF)\``, true)
                  }
                })
               await badword.findOne({ Guild: message.guild.id }, async(err, data) => {
                   if(data){ 
                    Admin.addField('Badword Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Admin.addField('Badword Settings', `\`🔴 (OFF)\``, true)
                  }
                })
                await caps.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Admin.addField('Capslock Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Admin.addField('Capslock Settings', `\`🔴 (OFF)\``, true)
                  }
                })
                await chatBot.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Admin.addField('Chat Bot Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Admin.addField('Chat Bot Settings', `\`🔴 (OFF)\``, true)
                  }
                })
                await react.findOne({ Guild : message.guild.id }, async(err, data) => {
                   if(data){ 
                    Admin.addField('Reaction Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Admin.addField('Reaction Settings', `\`🔴 (OFF)\``, true)
                  }
                })
                await verification.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Admin.addField('Verification Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Admin.addField('Verification Settings', `\`🔴 (OFF)\``, true)
                  }
                })
                await membercounter.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Admin.addField('Member Counter Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Admin.addField('Member Counter Settings', `\`🔴 (OFF)\``, true)
                  }
                })
                await welcome.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Admin.addField('Welcome Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Admin.addField('Welcome Settings', `\`🔴 (OFF)\``, true)
                  }
                })
                await leave.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Admin.addField('Leave Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Admin.addField('Leave Settings', `\`🔴 (OFF)\``, true)
                  }
                })
                 await leveltoggle.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Admin.addField('Level Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Admin.addField('Level Settings', `\`🔴 (OFF)\``, true)
                  }
                })

               await message.channel.send(Admin);
              break;
            case 'logs':
              const Logging = new MessageEmbed()
                .setTitle('System **`Logging`** Configuration(s)')
                // .setDescription('This Is Configuration System \`Logging\`\nIf Green Means Enable Or Actived\nIf Red Means Disable Or Not Actived')
                .setColor('#6082b6')
                .setTimestamp()
                .setColor(config.blue)
                .setFooter(config.footer);
                 //Logging
                await alllogs.findOne({ guildID : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('All Logs Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('All Logs Settings', `\`🔴 (OFF)\``, true)
                  }
                })
                await altdetectlogs.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Alt Detection Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Alt Detection Settings', `\`🔴 (OFF)\``, true)
                  }
                })
                await boostlogs.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Boost Logs Settings', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Boost Logs Settings', `\`🔴 (OFF)\``, true)
                  }
                })
                await channelcreate.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Channel Create Logs', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Channel Create Logs', `\`🔴 (OFF)\``, true)
                  }
                })
                await channeldelete.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Channel Delete Logs', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Channel Delete Logs', `\`🔴 (OFF)\``, true)
                  }
                })
                await channelupdate.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Channel Update Logs', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Channel Update Logs', `\`🔴 (OFF)\``, true)
                  }
                })
                await ghostPingSchema.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Ghost Ping Detector', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Ghost Ping Detectors', `\`🔴 (OFF)\``, true)
                  }
                })
                await guildmemberupdates.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Guild Member Update', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Guild Member Update', `\`🔴 (OFF)\``, true)
                  }
                })
                await guildupdates.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Guild Update', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Guild Update', `\`🔴 (OFF)\``, true)
                  }
                })
                await modlogs.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Moderation Logs', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Moderation Logs', `\`🔴 (OFF)\``, true)
                  }
                })
                 await invitelogs.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Invite Create Logs', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Invite Create Logs', `\`🔴 (OFF)\``, true)
                  }
                })
               await messagedelete.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Message Delete Logs', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Message Delete Logs', `\`🔴 (OFF)\``, true)
                  }
                })
                await messageupdate.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Message Update Logs', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Message Update Logs', `\`🔴 (OFF)\``, true)
                  }
                })
                await rolecreate.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Role Create Logs', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Role Create Logs', `\`🔴 (OFF)\``, true)
                  }
                })
                await roledelete.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Role Delete Logs', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Role Delete Logs', `\`🔴 (OFF)\``, true)
                  }
                })
                await roleupdate.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Role Update Logs', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Role Update Logs', `\`🔴 (OFF)\``, true)
                  }
                })
                await voicestate.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Voice State Update', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Voice State Update', `\`🔴 (OFF)\``, true)
                  }
                })
                await memberlogs.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Member Logger', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Member Logger', `\`🔴 (OFF)\``, true)
                  }
                }) 
                await levellogs.findOne({ _id : message.guild.id }, async(err, data) => {
                   if(data){
                    Logging.addField('Level Logger', `\`🟢 (ON)\``, true)
                  } 
                  if(!data) {
                    Logging.addField('Level Logger', `\`🔴 (OFF)\``, true)
                  }
                })  

              await message.channel.send(Logging);
              break;
          }
    }
}