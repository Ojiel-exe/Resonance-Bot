const prefixSchema = require('../../models/cmds/prefix')
const config = require('../../config.json')
// const prefix = config.prefix
// const { GENIUS_API_KEY } = require('../../config.json');
const fetch = require('node-fetch');
// const cheerio = require('cheerio')
const { stripIndents } = require("common-tags");
const { Util, MessageEmbed } = require('discord.js')

module.exports = {
    name: "lyric",
    aliases: ["l", "lyrics"],
    description: "Find Lyrics Of The Songs",
    category: "music",
    inVoiceChannel: true,
    timeout: 5000,
    usage: "!lyric",
    run: async(client, message, args) => {
    if (args.length < 1) return message.channel.send('Please enter the name of the song!');
		const song = await fetch(`https://some-random-api.ml/lyrics?title=${args.join(' ')}`).then(r => r.json());
		if (!song || !song.lyrics) {
			message.channel.stopTyping();
			return message.channel.send('Please type the command correctly, `!lyrics <songName>`!');
		}

  function split(content) {
	return Util.splitMessage(content, {
		maxLength: 2048
	});
}

		const embed = new MessageEmbed()
      .setTitle(song.title || 'Unknown')
      .setColor(config.blue)
			.setThumbnail(song.thumbnail ? song.thumbnail.genius : null)
			.setURL();

		const result = split(song.lyrics);
		if (Array.isArray(result)) {
			if (result.length > 1) {
				embed.setDescription(result[0])
					.addField('\u200b', result[1].substring(0, 1024))
					.setDescription(result[0]);
			} else {
				embed.setDescription(result[0]);
			}
		}

		return message.channel.send(embed);
        // const songName = args.join(" ");
        // if (!songName) {
        //     return message.error("music/lyrics:MISSING_SONG_NAME");
        // }

        // const embed = new MessageEmbed()
        //     .setAuthor(message.guild.name, message.guild.iconURL({ dyanmic: true }))
        //     .setColor("RANDOM")
        //     .setFooter(client.user.username, client.user.displayAvatarURL());

        // try {

        //     const songNameFormated = songName
        //         .toLowerCase()
        //         .replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "")
        //         .split(" ").join("%20");

        //     let res = await fetch(`https://www.musixmatch.com/search/${songNameFormated}`);
        //     res = await res.text();
        //     let $ = await cheerio.load(res);
        //     const songLink = `https://musixmatch.com${$("h2[class=\"media-card-title\"]").find("a").attr("href")}`;

        //     res = await fetch(songLink);
        //     res = await res.text();
        //     $ = await cheerio.load(res);

        //     let lyrics = await $("p[class=\"mxm-lyrics__content \"]").text();

        //     if (lyrics.length > 2048) {
        //         lyrics = lyrics.substr(0, 2031)
        //         embed.addField('===============================', `\u200b`)
        //         embed.addField('More Lyrics', `[\`Click Here For More Lyrics\`](https://www.musixmatch.com/search/${songName})`)
        //             // message.channel.send(`And More Lyrics`)
        //             // message.channel.send('[\`Click Here For Lyrics\`](https://www.musixmatch.com/search/${songName})');
        //     } else if (!lyrics.length) {
        //         return message.channel.send("error")
        //     }

        //     embed.setDescription(stripIndents `
        //     **__(<a:BSG_NoteDiamond:819061083414200321>) Songs Name : ${songName[0].toUpperCase() + songName.slice(1).toLowerCase()}__**

        //     **${lyrics}**
        //     `);
        //     message.channel.send(embed);

        // } catch (e) {
        //     return message.channel.send(`**${e.message} ${songName}**`)
        // }
    }
}