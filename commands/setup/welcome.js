const welcome = require("../../models/guild/welcome");
const prefixSchema = require("../../models/cmds/prefix");
const config = require("../../config.json");
const prefix = config.prefix;
const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "welcome",
  aliases: ["set-welcome"],
  description: "Setup Welcome Channel",
  category: "administration",
  // timeout: 5000,
  usage: "!welcome",
  // userPermissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
  // botPermissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
  run: async (client, message, args) => {
    if (message.deletable) message.delete();
    client.prefix = async function (message) {
      let custom;

      const data = await prefixSchema
        .findOne({ Guild: message.guild.id })
        .catch((err) => console.log(err));

      if (data) {
        custom = data.Prefix;
      } else {
        custom = prefix;
      }
      return custom;
    };
    const p = await client.prefix(message);

    let embed = new MessageEmbed()
      .setTitle("Welcome Setup")
      .setDescription(
        stripIndents`
        **📰 What Choice You Want To Use ?, Setup Welcome Channel ?**
        **✨ Please Choose The Answer : \`Set\` | \`Remove\` | \`Check\` | \`Test\`**
               
        **🌟 You Have 30 Seconds To Answer Or It Will Be Stop**`
      )
      .setColor(config.blue)
      .setFooter(config.footer)
      .setTimestamp();

    const msg = await message.channel.send(embed);
    const filter = (m) => m.author.id === message.author.id && !m.author.bot;
    const collector = await message.channel.createMessageCollector(filter, {
      max: 3,
      time: 30000,
    });

    collector.on("collect", async (collect) => {
      const response = collect.content.toLowerCase();
      await collect.delete();
      if (!response) {
        return msg.edit(
          embed.setDescription(stripIndents`
                    **❌ Invalid Choose Answer, Please Try Again**

                    **✨ Please Choose The Answer : \`Set\` | \`Remove\` | \`Check\` | \`Test\`**
                    **🌟 You Have 30 Seconds To Answer Or It Will Be Stop**`)
        );
      } else {
        collector.stop(
          msg.edit(
            embed.setDescription(stripIndents`
											**📰 What Channel You Want To Setup ?**
											
											**✨ Please Choose The Answer : \`Mention The Channel\`**
											**🌟 You Have 30 Seconds To Answer Or It Will Be Stop**`)
          )
        );
        if (response === "check") {
          await welcome.findOne(
            { _id: message.guild.id },
            async (err, data) => {
              if (!data) {
                msg.edit(
                  embed.setDescription(stripIndents`
											🕕 | Please Wait For 5 Seconds 
											`)
                );
                setTimeout(function () {
                  m.edit(
                    msg.edit(
                      embed.setDescription(stripIndents`
															❌ | This Server Doesn't Setup Welcome 
														`)
                    )
                  );
                }, 5000);
              }
              if (data) {
                const channels = message.guild.channels.cache.get(data.Channel);
                msg.edit(
                  embed.setDescription(stripIndents`
											🕕 | Please Wait For 5 Seconds 
											`)
                );
                setTimeout(function () {
                  msg.edit(
                    embed.setDescription(stripIndents`
												✅ | Channel Check Up : ${channels} 
														`)
                  );
                }, 5000);
              }
            }
          );
          return collector.stop();
        }
        if (response === "test") {
          await welcome.findOne(
            { _id: message.guild.id },
            async (err, data) => {
              msg.edit(
                embed.setDescription(stripIndents`
											🕕 | Please Wait For 5 Seconds 
											`)
              );
              if (!data) {
                setTimeout(function () {
                  msg.edit(
                    embed.setDescription(stripIndents`
															❌ | This Server Doesn't Setup Welcome 
														`)
                  );
                }, 5000);
              }
              if (data) {
                setTimeout(function () {
                  msg.edit(
                    embed.setDescription(stripIndents`
														✅ | Sucessfully Test, Please Check On : ${data.Channel} 
																	`)
                  );
                  client.emit("guildMemberAdd", message.member);
                }, 5000);
              }
            }
          );
          return collector.stop();
        }
      }
      const collector2 = await message.channel.createMessageCollector(filter, {
        max: 3,
        time: 30000,
      });

      collector2.on("collect", async (collect2) => {
        const response2 =
          collect2.mentions.channels.first() ||
          collect2.guild.channels.cache.get(args[1]);
        await collect2.delete();
        if (!response2) {
          return msg.edit(
            embed.setDescription(stripIndents`
                    **❌ Invalid Choose Answer, Please Try Again**

                    **✨ Please Choose The Answer : \`Mention The Channel\`**
                    **🌟 You Have 10 Seconds To Answer Or It Will Be Stop**`)
          );
        } else {
          if (response === "set") {
            await welcome.findOne(
              { _id: message.guild.id },
              async (err, data) => {
                if (!data) {
                  new welcome({
                    _id: message.guild.id,
                    Channel: response2.id,
                  }).save();
                  return msg.edit(
                    embed.setDescription(stripIndents`
																		**📰 Channel ${response2} Has Been Set As Welcome**
																`)
                  );
                }
                if (data) {
                  msg.edit(
                    embed.setDescription(stripIndents`
																🕕 | Please Wait For 5 Seconds 
																	`)
                  );
                  setTimeout(function () {
                    msg.edit(
                      embed.setDescription(stripIndents`
																	**This ${data.Channel} Channel & Server ${data._id} Already Setup**
																			`)
                    );
                  }, 5000);
                }
              }
            );
            return collector2.stop();
          }
          if (response === "remove") {
            await welcome.findOne(
              { _id: message.guild.id },
              async (err, data) => {
                if (!data) {
                  msg.edit(
                    embed.setDescription(stripIndents`
														🕕 | Please Wait For 5 Seconds 
														`)
                  );
                  setTimeout(function () {
                    msg.edit(
                      embed.setDescription(stripIndents`
																		❌ | This Server Doesn't Setup Welcome 
																	`)
                    );
                  }, 5000);
                }
                if (data) {
                  msg.edit(
                    embed.setDescription(stripIndents`
															🕕 | Please Wait For 5 Seconds 
															`)
                  );
                  setTimeout(function () {
                    data.delete();
                    msg.edit(
                      embed.setDescription(stripIndents`
																	✅ | Okey Data Has Been Deleted 
																	`)
                    );
                  }, 5000);
                }
              }
            );
            return collector2.stop();
          }
        }
      });
    });
    try {
      collector.on("end", (collected, reason) => {
        if (reason === "time") {
          msg.edit(
            embed.setDescription(stripIndents`
								**❌ Invalid Choice Answer, Please Try Again**

								**🕕 Time's Up, Try Again!**
										`)
          );
        }
      });
      collector2.on("end", (collected, reason) => {
        if (reason === "time") {
          msg.edit(
            embed.setDescription(stripIndents`
								**❌ Invalid Choice Answer, Please Try Again**

								**🕕 Time's Up, Try Again!** 
								`)
          );
        }
      });
    } catch (e) {}

    //  const embed = new MessageEmbed()
    //   .setColor("DARK-BLUE")
    //   .setDescription(stripIndents `
    //   **Welcome To \`Reaction Commands\` Command!**

    //   **Please Choose The Option Below**

    //   <a:HC_arrow1:880730912376459285> ** Type : \`${p}welcome set <mention | id channel>\` **
    //   <a:HC_arrow1:880730912376459285> ** Type : \`${p}welcome remove\` **
    //   <a:HC_arrow1:880730912376459285> ** Type : \`${p}welcome check\` **
    //   `)
    //   .setFooter(config.footer)
    //   .setTimestamp()

    //   if (!args[0]){
    //       return message.channel.send(embed)
    //   }

    //   if (args[0].toLowerCase() === "set") {
    //       const { guild } = message
    //       const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
    //       if (!channel) return message.reply("Please Mention Channel")

    //       welcome.findOne({ _id: guild.id }, async(err, data) => {
    //           if (data) {
    //               data.Channel = channel.id;
    //               data.save();
    //           } else {
    //               new welcome({
    //                   _id: guild.id,
    //                   Channel: channel.id,
    //               }).save();
    //           }
    //           message.reply(`Channel ${channel} Has Been Set As Welcome`)
    //       })
    //   }
    //   if (args[0].toLowerCase() === "check") {
    //       const { guild } = message
    //       welcome.findOne({
    //           _id: guild.id
    //       }, async(err, data) => {
    //           if (!data) return message.reply('This Guild Has No Data To Stored')
    //           const channel = client.channels.cache.get(data.Channel);
    //           message.reply(`Welcome Channel | ${channel}`);

    //       })
    //   }
    //   if (args[0].toLowerCase() === "remove") {
    //       const { guild, channel } = message
    //       welcome.findOneAndDelete({
    //           _id: guild.id
    //       }, async(err, data) => {
    //           if (!data) return message.reply('This Guild Has No Data To Stored')
    //           message.reply(`Data Has Been Removed`);

    //       })
    //   }
    //   if (args[0].toLowerCase() === "test") {
    //       client.emit('guildMemberAdd', message.member);
    //   }
  },
};
