//const membercount = require('../models/membercount')
const { stripIndents } = require("common-tags");
const leave = require('../../models/guild/leave')
const memberlogs = require('../../models/guild/member-logs')
// const { CanvasSenpai } = require("canvas-senpai")
// const canva = new CanvasSenpai();
const moment = require("moment");
const canvas = require("discord-canvas");
const config = require('../../config.json')
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports.run = async (client, member) => {

  if (member.user.username.length > 25) member.user.username = member.user.username.slice(0, 25) + "...";
  if (member.guild.name.length > 15) member.guild.name = member.guild.name.slice(0, 15) + "...";

    await leave.findOne({ _id: member.guild.id }, async (err, data) => {
        if (!data) {
            return;
        }
        if (data) {
           let LeaveImage = `https://cdn.discordapp.com/attachments/911944129687207968/914433170785570816/1920x1080-black-solid-color-background.jpg`
            // let Msg = ``**Thank You To Stay Our \`${member.guild.name}\`, Server. Now We Have ${member.guild.memberCount}th Member. Enjoy**`,`
             let Leaved = await new canvas.Goodbye()
             let Image = await Leaved
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
              .setBackground(LeaveImage || "https://cdn.discordapp.com/attachments/911944129687207968/914433170785570816/1920x1080-black-solid-color-background.jpg")
              .toAttachment();
            let Attachment = new MessageAttachment(Image.toBuffer(), "Leave.png");
						
            const channel = client.channels.cache.get(data.channels);
              if(channel){
							const Embed = new MessageEmbed()
							.setAuthor(`${member.user.username}`, member.user.displayAvatarURL({ dynamic: true }))
							.setDescription(`Thanks For Stay Our Server *${member.guild.name}*`)
							.attachFiles(Attachment)
							.setImage('attachment://Leave.png')
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
    })

    //This Is For Logs
    await memberlogs.findOne({ _id: member.guild.id }, async (err, data) => {
        if (!data) {
            return;
        }
        if (data) {
            const embed = new MessageEmbed()
                .setAuthor(member.user.tag, member.user.displayAvatarURL({ size: 4096, dynamic: true }))
                .setThumbnail(member.user.displayAvatarURL({ dynamic : true }))
                .setDescription(`Information About Members Has Leaved The Server`)
                .addFields(
                  { name : "User Tag", value :`\`${member.user.tag}\``, inline : true},
                  { name : "Discriminator", value : `\`${member.user.discriminator}\``, inline : true},
                  { name : "Verified",  value : `\`${member.user.bot}\``, inline : true},
                  { name : "Presence",  value : `\`${member.user.presence.status}\``, inline : true},
                  { name : "Joined Server At", value : `\`${moment(member.joinedAt).format(`MM-DD-YYYY`)}\``, inline : true},
                  { name : "Joined Discord At",  value : `\`${moment(member.user.createdAt).format(`MM-DD-YYYY`)}\``, inline : true},
									{ name : "Total Member",  value :`${member.guild.memberCount.toLocaleString()}`, inline : true}
                  )
                
                .setColor(config.red)
                .setTimestamp()
                .setFooter(config.footer)

            const target = client.channels.cache.get(data.ChannelID);
            if(target){
            target.send(embed)
            } else {
              return
            }
        }
    });

}