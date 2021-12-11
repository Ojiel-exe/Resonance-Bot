const {
  MessageEmbed,
  Message,
  Client
} = require("discord.js");
const {
  readdirSync
} = require("fs");
const {
  MessageButton,
  MessageActionRow
} = require("discord-buttons")
const { stripIndents } = require("common-tags");

// const ButtonPages = require('discord-button-pages');
const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
const prefix = config.prefix

module.exports = {
  name: "help",
  aliases: ["helped"],
  description: "help command",
  category: "general",
  timeout: 5000,
  usage: "!help",
  run: async (client, message, args) => {

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

      const color =
          message.guild.me.displayHexColor === "#000000" ?
              "#ffffff" :
              message.guild.me.displayHexColor;

      let avatar = message.author.displayAvatarURL({ dynamic: true })


      if (!args[0]) {
        // let categories = [];

        //  const dirEmojis = {
        //     administration: "`🔧`",
        //     general: "`🧮`",
        //     economy: "`💶`",
        //     information: "`📙`",
        //     invites: "`💍`",
        //     level: "`🆙`",
        //     giveaway: "`🎉`",
        //     music: "`🎵`",
        //     moderation: "`📛`",
        //     logs: "`🔃`",
        //     utility: "`🔍`",
        //     youtube: "`▶`",
        //     owner: "`💻`",
        //     premium: "`💷`",
        //     support: "`✉`",
        //     fun: "`😂`",
        //     server: "`🌏`",
        //     toggle: "`🔄`",
        //     setup : "`🕹`"
        // }


        // readdirSync("./commands/").forEach((dir) => {
            
        //     const editiedName = `${dirEmojis[dir]} ${dir[0].toUpperCase() + dir.slice(1).toLowerCase()}`;
        //     let cats = new Object();

        //     cats = {
        //         name: editiedName,
        //         value: `\`${p}help ${dir.toLowerCase()}\``,
        //         inline: true
        //     }


        //     categories.push(cats);
        //     //cots.push(dir.toLowerCase());
        // });

        const embed = new MessageEmbed()
          .setAuthor(client.user.username + " Command List", client.user.displayAvatarURL({dynamic : true}))
          .setThumbnail(message.guild.iconURL())
          .setDescription(`
          **Hi There 👋**
          My Prefix in __***${message.guild.name}***__ is \`${p}\`.
          To see list command, Type \`${p}help <categories>\`
          To see info for that command, Type \`${p}help <command>\`

          Categories List Commands 

          \`🔧\` ・ **Administration**
          \`📰\` ・ **General**
          \`💶\` ・ **Economy** 
          \`😂\` ・ **Fun**
          \`📜\` ・ **Information**
          \`📊\` ・ **Invites** 
          \`🛹\` ・ **Leaderboard** 
          \`🎉\` ・ **Giveaway** 
          \`🎵\` ・ **Music** 
          \`📛\` ・ **Moderation** 
          \`🔃\` ・ **logger** 
          \`🔍\` ・ **Utility** 
          \`🔴\` ・ **Youtube** 
          \`💻\` ・ **Owner**
          \`💷\` ・ **Premium**
          \`📨\` ・ **Support**
          \`🌏\` ・ **Server** 
          \`🔄\` ・ **Toggle** 
          \`🔛\` ・ **Setup**

          *If need help, find some bugs command, have trouble using any of my commands, you can join our server by click our button down below, or type \`${p}bug <message>\`*.
          `)
          // .addFields(categories)
          .setColor(color)
          .setTimestamp()
          .setFooter(`${client.user.username} - ${message.guild.name} Ojiel.exe © 2021 | Total Commands - ${client.commands.size - 1}`)
          .setTimestamp()
          .setColor(color);

          let instagram = new MessageButton()
          .setStyle("url")
          .setLabel("Follow Us")
          .setURL(`https://www.instagram.com/restgangs.id/`)

          let invite = new MessageButton()
          .setStyle("url")
          .setLabel("Invite Me")
          .setURL("https://discord.com/oauth2/authorize?client_id=913689331699417098&scope=bot&permissions=716720569599")

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
    } else {
      let cots = [];
      let catts = [];

      readdirSync("./commands/").forEach((dir) => {
        if (dir.toLowerCase() !== args[0].toLowerCase()) return;
        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
            file.endsWith(".js")
        );

        const cmds = commands.map((command) => {
          let file = require(`../../commands/${dir}/${command}`);

          if (!file.name) return "No command name.";

          let name = file.name.replace(".js", "");

          let des = client.commands.get(name).description;

          let obj = {
              cname: `${name}` ,
              des
          }

          return obj;
      });

      let dota = new Object();

      cmds.map(co => {
        const dota = `${cmds.length === 0 ? "In progress." : co.cname}`
        // const dota = `● ${cmds.length === 0 ? "In progress." : co.cname} | *${co.des ? co.des : 'No Description'}*`
          // dota = {
              // name: `● ${cmds.length === 0 ? "In progress." : co.cname} | ${co.des ? co.des : 'No Description'}`,
              // value: `${co.des ? co.des : 'No Description'}`,
              // inline: false,
          // }
          catts.push(dota);
      });

      cots.push(dir.toLowerCase());
  });

                const command =
      client.commands.get(args[0].toLowerCase()) ||
      client.commands.find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
      );

    if (cots.includes(args[0].toLowerCase())) {
      const embed = new MessageEmbed()
          // .setTitle(`__${args[0].charAt(0).toUpperCase() + args[0].slice(1)} Commands!__`)
          .setAuthor(client.user.username + " Command List", client.user.displayAvatarURL({dynamic : true}))
          .setDescription(`
          **Hi There 👋**
          My Prefix in __***${message.guild.name}***__ is \`${p}\`.
          To see info for that command, Type \`${p}help <command>\`

          __${args[0].charAt(0).toUpperCase() + args[0].slice(1)} Commands!__
          *\`\`\`yaml\n${catts.join(', ')}\`\`\`*
          
           *If need help, find some bugs command, have trouble using any of my commands, you can join our server by click our button down below, or type \`${p}bug <message>\`*.`)
          // .addFields(catts)
          .setColor("RANDOM");
            let invite = new MessageButton()
          .setStyle("url")
          .setLabel("Invite Me")
          .setURL("https://discord.com/oauth2/authorize?client_id=913689331699417098&scope=bot&permissions=716720569599")

          let server = new MessageButton()
          .setStyle("url")
          .setLabel("Support Server")
          .setURL("https://discord.gg/PjN5DtskXz")

          let website = new MessageButton()
          .setStyle("url")
          .setLabel("Website")
          .setURL("https://linktr.ee/Ojiel.exe")

          let row = new MessageActionRow()
          // .addComponents(instagram)
          .addComponents(invite)
          .addComponents(server)
          .addComponents(website)

          return message.channel.send({
              embed: embed,
              components: [row]
          });
      // return message.channel.send(embed);

  }

    if (!command) {
      const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic : true}))
            .setThumbnail(client.user.displayAvatarURL({ dynamic : true }))
            .addField(`Wrong Commands !!`, `type \`${p}help <commands>\` to get info of the commands, if you have any questions or need help with ${client.user.username}, Contact <@596274875820408842>`)
            .setColor(config.red)
            .setFooter(config.footer)
      return message.channel.send(embed)
      .then(m => m.delete({timeout : 10000}));
  }

  const embed = new MessageEmbed()
      .setTitle(`Command Help \`${args[0]}\``)
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(stripIndents`
      > **💎 Prefix : \`${p}\`**
      > **💎 Name : \`${command.name ? command.name : "No Name Command"}\`**
      > **💎 Aliases : \`${command.aliases ? command.aliases.join("` `") : "No Aliases Command"}\`**
      > **💎 Usage : \`${command.usage ? command.usage : command.name}\`**
      > **💎 Description : \`${command.description ? command.description : "No Description Command"}\`**
      
      `)
      .setFooter(config.footer)
      .setTimestamp(new Date())
      .setColor("RANDOM")
  return message.channel.send(embed);
      }
  }
}