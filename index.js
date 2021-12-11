const DisTube = require("distube")
const { stripIndents } = require("common-tags");
const { Client, Collection, MessageEmbed } = require('discord.js')
const config = require('./config.json')
const client = new Client({
    disableEveryone: true
  });
const fs = require('fs');

const reaction = require('./models/cmds/reaction')
const reacttoggle = require('./models/toggles/reacttoggle')
const afktoggle = require('./models/toggles/afktoggle')
const afk = require('./models/cmds/afk')
const modlogs = require('./models/guild/modlogs')

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
})
client.commands = new Collection()
client.aliases - new Collection()
client.mongoose = require('./database/mongoose');
client.categories = fs.readdirSync('./commands/');

// Posisinya baca isi file ready ama event logger
["command", "event"].forEach(handler =>{
    require(`./handlers/${handler}`)(client)
})

require('discord-buttons')(client)

client.modlogs = async function ({ Member, Color, Action, Reason }, message) {
  const data = await modlogs.findOne({ _id: message.guild.id })
  if (!data) {
    return
  }
  if (data) {
    const LogsEmbed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(stripIndents`
    **⚠ Action Took : \`${Action}\`**

    > **<:RG_ServerIcon:912880402488762399> Member : ${Member.user.username}**
    > **<:RG_ServerIcon:912880402488762399> Reason : ${Reason}**   
    `)
      .setFooter(config.footer)
      .setColor(Color)

    const logsend = message.guild.channels.cache.get(data.Channel)
    if (logsend) {
      logsend.send(LogsEmbed)
    } else {
      return
    }
  }
}

client.on('message', async (message) => {
  if (!message.guild || message.author.bot) return
  await reacttoggle.findOne({ _id: message.guild.id }, async (err, data) => {
    if (!data) {
      return
    }
    if(data){
      if (data.toggle = true) {
        await reaction.findOne({ Guild: message.guild.id, Content1: message.content }, async (err, data) => {
          if (!data) {
            return;
          }
          if (data) {
            if (message.content.toLowerCase() === `${data.Content1}`) {
              message.channel.send(`${data.Content2}`)

            }
          }
        })
      }
       if(data.toggle = false){
        return
      }
    }
  })
})

client.on('message', async (message) => {
  if (!message.guild || message.author.bot) return
  await afktoggle.findOne({ _id: message.guild.id }, async (err, data) => {
    if(!data){
      return
    }
    if(data){
      if (data.toggle = true) {
        let data2;
          try{
              data2 = await afk.findOne({
                User : message.author.id,
                Guild : message.guild.id
              })
              if(!data2){
                  data2 = await afk.create({
                    User : message.author.id,
                    Guild : message.guild.id  
                })
              }
          } catch(e){
            message.channel.send(`ERROR 404 : ${e.message}`)
          }

          if(data2.AFK === true){
            data2.Reason = null
            data2.AFK = false
            message.channel.send(`Welcome Back <@${message.author.id}>, I removed you from AFK`)
            .then(m => m.delete({ timeout : 10000 }))
            await data2.save()
          }

          if(message.mentions.members.first()){
            let data3;
            try{
              data3 = await afk.findOne({
                User : message.mentions.members.first().id,
                Guild : message.guild.id
              })
                if(!data3){
                  data3 = await afk.create({
                  User : message.mentions.members.first().id,
                  Guild : message.guild.id
                })
              }
            } catch (e){
              message.channel.send(`ERROR 404 : ${e.message}`)
              .then(m => m.delete({timeout : 5000}))
            }

            if(data3.AFK === true){
              message.channel.send(`<@${message.mentions.members.first().user.id}> : ${data3.Reason || " Emergency"}`)
               .then(m => m.delete({ timeout : 10000 }))
            }          
          }
        }
      if(data.toggle = false){
        return
      }
    }
  })
})

// const distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true, leaveOnFinish: true });

const status = queue => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``


// player.distube = new distube(client, { searchSongs: false, emitNewSongOnly: true })
client.distube
  //distube
  .on("addList", (message, queue, playlist) => {
    let thing = new MessageEmbed()
      .setColor(message.client.color)
      .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
      .setDescription(`Added **${playlist.title}** playlist (${playlist.total_items} songs) to the queue`)
      .setThumbnail(playlist.thumbnail)
      .setFooter(config.footer);
    message.channel.send(thing);
  })
  .on("addSong", (message, queue, song) => {
    let thing = new MessageEmbed()
      .setColor(message.client.color)
      .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
      // .setDescription(
      //     `
      //     Added Songs : **${song.name}**
      //     Songs Duration : \`[${song.formattedDuration}]\`

      //     ${status(queue)}
      //     `
      // )
      .addField(`**Added New Songs**`, `\`${song.name}\``)
      .addField(`**Song Duration**`, `\`${song.formattedDuration}\``)
      .setImage(song.thumbnail)
      .setFooter(config.footer)
    message.channel.send(thing);
  })
  .on("empty", message => {
    let thing = new MessageEmbed()
      .setColor("RED")
      .setDescription(`Channel is empty. Leaving the channel`)
    message.channel.send(thing);
  })
  .on("error", (message, err) => {
    let thing = new MessageEmbed()
      .setColor("RED")
      .setDescription(`An error encountered: ${err}`)
    message.channel.send(thing);
  })
  .on("finish", message => {
    let thing = new MessageEmbed()
      .setColor("RED")
      .setDescription(`No more song in queue`)
    message.channel.send(thing);
  })
  .on("initQueue", queue => {
    queue.autoplay = false;
  })
  .on("noRelated", message => {
    let thing = new MessageEmbed()
      .setColor("RED")
      .setDescription(`Can't find related video to play. Stop playing music.`)
    message.channel.send(thing);
  })
  .on("playList", (message, queue, playlist, song) => {
    let thing = new MessageEmbed()
      .setColor(message.client.color)
      .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
      // .setDescription(
      //     `Play : **${playlist.title}** 
      //     Playlist :  (${playlist.total_items} songs)
      //     Now : **${song.name}** - \`[${song.formattedDuration}]\`
      //     `)
      .addField(`**Play Songs**`, `\`${playlist.title}\``, false)
      .addField(`**Playlist Songs**`, `\`${playlist.total_items}\``, false)
      .addField(`**Play Now**`, `\`${song.name}\``, false)
      .addField(`**Duration**`, `\`${song.formattedDuration}\``, false)
      //.addField("Status Queue", `Request by: ${message.author.tag} ~ ${status(queue)}`, false)
      .setImage(playlist.thumbnail)
      .setFooter(config.footer) //`Request by: ${message.author.tag} ~ ${status(queue)}`, message.author.displayAvatarURL());
    message.channel.send(thing);
  })
  .on("playSong", (message, queue, song) => {
    let thing = new MessageEmbed()
      .setColor(message.client.color)
      .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
      // .setDescription(
      //     `
      //     **Name : \`${song.name}\`**
      //     **Duration : \`${song.formattedDuration}\`**
      //     **Request : \`${message.author.tag}\`**

      //     ${status(queue)}
      //     `)
      .addField(`**Songs Name**`, `\`${song.name}\``, false)
      .addField(`**Songs Duration**`, `\`${song.formattedDuration}\``, false)
      .addField(`**Songs Request**`, `\`${message.author.tag}\``, false)
      .addField("Status Queue", `${status(queue)}`, false)
      .setImage(song.thumbnail)
      .setFooter(config.footer)
    message.channel.send(thing);
  })
  // DisTubeOptions.searchSongs = true
  .on("searchCancel", message => {
    let thing = new MessageEmbed()
      .setColor("RED")
      .setDescription(`Searching canceled!`)
    message.channel.send(thing);
  })
  // DisTubeOptions.searchSongs = true
  .on("searchResult", (message, result) => {
    let i = 0
    //i.length = 10;
    let thing = new MessageEmbed()
      .setColor(message.client.color)
      .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
      .setDescription(
        `**ℹ Please Choose Option On Leaderboard**
                    
                    ${result.map(song => `**${++i})**. ${song.name} - \`${song.formattedDuration}\``)
          .join("\n")}
                    
                    ℹ **To Cancel Standby For 60 Seconds**
                    `)
      .setFooter(config.footer)//`Enter anything else or wait 60 seconds to cancel`);
    message.channel.send(thing);
  });
//client.distube = distube;
//client.distube = distube


client.mongoose.init();
client.login(config.token);
  