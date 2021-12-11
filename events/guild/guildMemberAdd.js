const welcome = require('../../models/guild/welcome')
const memberlogs = require('../../models/guild/member-logs')
const autoroleusers = require('../../models/guild/autoroleusers')
const autorolebots = require('../../models/guild/autorolebots')

const canvas = require("discord-canvas");
const config = require('../../config.json')
const altdetect = require('../../models/anti/altdetect')
const altdetectlogs = require('../../models/guild/altdetectlogs')
const moment = require("moment");

const muted = require('../../models/cmds/mutesystem')

const captchatoggle = require('../../models/toggles/captchatoggle')
const captcha = require('../../models/guild/captcha')

const { stripIndents } = require('common-tags')
const { Captcha } = require('captcha-canvas');
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports.run = async (client, member) => {

  await muted.findOne({ _id : member.guild.id }, async(err , data) => {
    if(!data){
      return
    }
    if(data){
      const user = data.Users.findIndex((prop) => prop === member.id)
      if(user == -1){
        return
      }
      const role = member.guild.roles.cache.find((role) => role.name.toLowerCase() == "Muted" || "Mute" || "muted" || "mute")
      member.roles.add(role.id)
    }
  })

  if (member.user.username.length > 25) member.user.username = member.user.username.slice(0, 25) + "...";
  if (member.guild.name.length > 15) member.guild.name = member.guild.name.slice(0, 15) + "...";

    await welcome.findOne({ _id: member.guild.id }, async (err, data) => {
        if (!data) {
            return
        }
        if (data) {
            let WelcomeImage = `https://media.discordapp.net/attachments/908536819405160488/918384263383117905/sonic-exe.gif`
            let Msg = `**Welcome To \`${member.guild.name}\` Server, Hi \`${member.user.tag}\`\nYou Are Our \`${member.guild.memberCount}-th\` Member. Enjoy**`
            let Welcomed = new canvas.Welcome();
            let Image = await Welcomed
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
            .setGuildName(member.guild.name)
            .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "jpg" }))
            .setMemberCount(member.guild.memberCount)
						.setColor("border", "#FFFFFF")
						.setColor("username-box", "#FFFFFF")
						.setColor("discriminator-box", "#FFFFFF")
						.setColor("message-box", "#FFFFFF")
						.setColor("title", "#FFFFFF")
						.setColor("avatar", "#FFFFFF")
            .setBackground(WelcomeImage || "https://media.discordapp.net/attachments/908536819405160488/918384263383117905/sonic-exe.gif")
            .toAttachment();
          let Attachment = new MessageAttachment(Image.toBuffer(), "Welcome.png");
          const channel = client.channels.cache.get(data.Channel);
          if (channel) {
						   const Embed = new MessageEmbed()
							.setAuthor(`${member.user.username}`, member.user.displayAvatarURL({ dynamic: true }))
							.setDescription(`Welcome To Our Server ${member.guild.name}`)
							.attachFiles(Attachment)
							.setImage('attachment://sonic-exe.gif')
							.addFields(
                  { name : "User Tag", value :`\`${member.user.tag}\``, inline : true},
                  { name : "Discriminator", value : `\`${member.user.discriminator}\``, inline : true},
                  { name : "Verified",  value :`\`${member.user.bot}\``, inline : true},
                  { name : "Presence",  value : `\`${member.user.presence.status}\``, inline : true},
                  { name : "Joined Server At", value :`\`${moment(member.joinedAt).format(`MM-DD-YYYY`)}\``, inline : true},
                  { name : "Joined Discord At",  value :`\`${moment(member.user.createdAt).format(`MM-DD-YYYY`)}\``, inline : true},
									{ name : "Total Member",  value :`\`${member.guild.memberCount.toLocaleString()}\``, inline : true})
              channel.send(Embed)
          } else {
              return
          }
        }
    });


    //This Is For Logs
    await memberlogs.findOne({ _id: member.guild.id }, async (err, data) => {
        if (!data) {
            return
        }
        if (data) {
            const embed = new MessageEmbed()
                .setAuthor(member.user.tag, member.user.displayAvatarURL({ size: 4096, dynamic: true }))
                .setThumbnail(member.user.displayAvatarURL({ dynamic : true }))
                .setDescription(`Information About Members Has Joined The Server`)
                .addFields(
                  { name : "User Tag", value :`\`${member.user.tag}\``, inline : true},
                  { name : "Discriminator", value : `\`${member.user.discriminator}\``, inline : true},
                  { name : "Verified",  value :`\`${member.user.bot}\``, inline : true},
                  { name : "Presence",  value : `\`${member.user.presence.status}\``, inline : true},
                  { name : "Joined Server At", value :`\`${moment(member.joinedAt).format(`MM-DD-YYYY`)}\``, inline : true},
									{ name : "Joined Discord At",  value :`\`${moment(member.user.createdAt).format(`MM-DD-YYYY`)}\``, inline : true},	
									{ name : "Total Member",  value :`${member.guild.memberCount.toLocaleString()}`, inline : true})
                
                .setColor(config.green)
                .setTimestamp()
                .setFooter(config.footer)

            const channels = client.channels.cache.get(data.ChannelID);
            if (channels) {
                channels.send(embed)
            } else {
                return
            }
        }
    });
    autoroleusers.findOne({ _id: member.guild.id }, async (err, data) => {
        if (!data) {
            return
        }
        if (data) {
            if (!member.user.bot) {
                const role = member.guild.roles.cache.get(data.Role)
                member.roles.add(role)
                console.log(`Auto Roles Humans Given To ${member.user.username}`)
            }
        }
    })

    autorolebots.findOne({ _id: member.guild.id }, async (err, data) => {
        if (!data) {
            return
        }
        if (data) {
            if (member.user.bot) {
                const role = member.guild.roles.cache.get(data.Role)
                member.roles.add(role)
                console.log(`Auto Roles Bots Given To ${member.user.username}`)
            }
        }
    })

    await captchatoggle.findOne({ _id : member.guild.id }, async(err, data) =>{
      if(!data){
        return
      }
      if(data){
        if(data.toggle = true){

        const captcha = new Captcha();
        captcha.async = true;
        captcha.addDecoy(); 
        captcha.drawTrace(); 
        captcha.drawCaptcha();

          const attachment = new MessageAttachment(
            await captcha.png,
             "captcha.png"
             );
       const msg = await member.send({ files: [attachment], content: 'Please Write What You See On The Image Bellow To Gain Member Permissions!', })
       
       const role = member.guild.roles.cache.get(data.Role);

       const filter = (message) => {
           if(message.author.id !== member.id) {
             return;
           }
           if(message.content === captcha.text) {
             return true;
           }
           else {
             member.send(`:x: Wrong Captcha Text!`)
           }
       };

      const resp = await msg.channel.awaitMessages({
          filter,
          max: 1,
          time: 60000,
          errors: ["time"], 

          });

          if(resp) {
              member.roles.add(role);
              member.send(`😊 Thank You! Now Enjoy The Server.`)
          }
        }
        if(data.toggle = false){
          return
        }
      }
  
    })
}