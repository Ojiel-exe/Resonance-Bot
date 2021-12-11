const { MessageEmbed } = require('discord.js')
const moment = require('moment');
//const pagination = require('discord.js-pagination');
const { stripIndents } = require("common-tags");
const filterLevels = {

    DISABLED: 'Off',

    MEMBERS_WITHOUT_ROLES: 'No Role',

    ALL_MEMBERS: 'Everyone'

};

const verificationLevels = {

    NONE: 'None',

    LOW: 'Low',

    MEDIUM: 'Medium',

    HIGH: '(╯°□°）╯︵ ┻━┻',

    VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'

};

const regions = {

    brazil: 'Brazil',

    europe: 'Europe',

    hongkong: 'Hong Kong',

    india: 'India',

    japan: 'Japan',

    russia: 'Russia',

    singapore: 'Singapore',

    southafrica: 'South Africa',

    sydeny: 'Sydeny',

    us_central: 'US Central',

    us_east: 'US East',

    us_west: 'US West',

    us_south: 'US South'

};
const config = require('../../config.json')
const prefix = config.prefix

module.exports = {
    name: "server",
    aliases: ["serverinfo", "si"],
    description: "Check Information About Server",
    category: "information",
    // timeout: 5000,
    usage: "!server",
    run: async(client, message, args) => {

        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());

        const members = message.guild.members.cache;

        const channels = message.guild.channels.cache;

        const emojis = message.guild.emojis.cache;

        const vanityCode = message.guild.vanityURLCode;
        let vanityInvite = `https://discord.gg/${vanityCode}`;
        if (!vanityCode){
              vanityInvite = 'No Custome URL';
        } 

        if (message.guild.premiumTier === "Level 0") message.guild.premiumTier = "<:Level0:734479590852132905> 0"
        if (message.guild.premiumTier === "Level 1") message.guild.premiumTier = "<:713173920475381830:734479841629437982> 1"
        if (message.guild.premiumTier === "Level 2") message.guild.premiumTier = "<:713173919418548257:734479792052764774> 2"
        if (message.guild.premiumTier === "Level 3") message.guild.premiumTier = "<:BoostLevel3:734479712029769849> 3"

        let boostlevel = message.guild.premiumTier
            // let boostTier;
            // switch (message.guild.premiumTier) {
            //     case "Level 0":
            //         status = "<:Level0:734479590852132905> 0";
            //         break;
            //     case "Level 1":
            //         status = "<:713173920475381830:734479841629437982> 1";
            //         break;
            //     case "Level 2":
            //         status = "<:713173919418548257:734479792052764774> 2";
            //         break;
            //     case "Level 3":
            //         status = "<:BoostLevel3:734479712029769849> 3";
            //         break;
            // }

        const guildName = message.guild.name;
        const guildID = message.guild.id;
        const owner = message.guild.owner.user.username;
        //const regions = `${regions[message.guild.region]}`;
        const boost = `${message.guild.premiumSubscriptionCount || '0'}`
        const server = `${message.guild.memberCount}`
        const humans = `${members.filter(member => !member.user.bot).size}`
        const bots = `${members.filter(member => member.user.bot).size}`
        const voice = `${channels.filter(channel => channel.type === 'voice').size}`
        const text = `${channels.filter(channel => channel.type === 'text').size}`

        const guild = new MessageEmbed()
            .setTitle(`Server Information ${guildName}`)
            .setFooter(message.guild.name, message.guild.iconURL())
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setColor("GREEN")
            //.addField
            .setDescription(stripIndents `
                 **__(<:RG_ServerIcon:912880402488762399>) Profile Server__**

                > **• \`Server Name\` | \`${guildName}\`**
                > **• \`Owner Server\` | \`${owner}\`**
                > **• \`Region Server\` | \`${regions[message.guild.region]}\`**
                > **• \`Boost Tier\`  | \`${boostlevel}\`**
                > **• \`Vanity URL\` | \`${vanityCode || "Empty"}\`**
                > **• \`Time Created\`  | \`${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}\`**

                **__(<:RG_ServerIcon:912880402488762399>) Perks Server__**

                > **• \`Role Counts\` | \`${roles.length}\`**
                > **• \`Emoji Counts\`  | \`${emojis.size}\`**
                > **• \`Verification Server\`  | \`${verificationLevels[message.guild.verificationLevel]}\`**
                > **• \`Boost Counts\`  | \`${boost}\`**
                > **• \`Regular Emoji Counts\`  | \`${emojis.filter(emoji => !emoji.animated).size}\`**
                > **• \`Animated Emoji Counts\`  | \`${emojis.filter(emoji => emoji.animated).size}\`**
                
                **__(<:RG_ServerIcon:912880402488762399>) Stats Server__**

                > **• \`Total All Members\`  | \`${server}\`**
                > **• \`Total Humans Only\`  | \`${humans}\`**
                > **• \`Total Bots Only\`  | \`${bots}\`**
                > **• \`Voice Channels\`  | \`${voice}\`**
                > **• \`Text Channels\`  | \`${text}\`**
                > **• \`Explicit Filters\`  | \`${filterLevels[message.guild.explicitContentFilter]}\`**
                `)
            .setTimestamp()
        message.channel.send(guild)
            // const guild = new MessageEmbed()
            //     .setTitle(`Statistic - ${message.guild.me.displayName}`)
            //     .setColor("RED")
            //     .setThumbnail(message.guild.iconURL({ dynamic: true }))
            //     .addFields({
            //         name: `** Name** `,
            //         value: ` \`${message.guild.name}\``,
            //         inline: true
            //     }, {
            //         name: `** ID** `,
            //         value: ` \`${message.guild.id}\``,
            //         inline: true
            //     }, {
            //         name: `** Owner** `,
            //         value: ` \`${message.guild.owner.user.tag}\``,
            //         inline: true
            //     }, {
            //         name: `** Region** `,
            //         value: ` \`${regions[message.guild.region]}\``,
            //         inline: true
            //     }, {
            //         name: `** Boost Tier** `,
            //         //value: ` \`${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None' }\``,
            //         value: `${boostTier}`,
            //         inline: true
            //     }, {
            //         name: ` ** Explicit Filter** `,
            //         value: `\` ${filterLevels[message.guild.explicitContentFilter]}\``,
            //         inline: true
            //     }, {
            //         name: ` ** Verification ** `,
            //         value: ` \`${verificationLevels[message.guild.verificationLevel]}\``,
            //         inline: true
            //     }, {
            //         name: ` ** Time Created**`,
            //         value: `  \`${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}\``,
            //         inline: false
            //     })
            //     .setTimestamp();

        // const roleses = new MessageEmbed()
        //     .setTitle(`Statistic - ${message.guild.me.displayName}`)
        //     .setColor("GREEN")
        //     .setThumbnail(message.guild.iconURL({ dynamic: true }))
        //     .addFields({
        //         name: `** Role Count ** `,
        //         value: ` \`${roles.length}\``,
        //         inline: true
        //     }, {
        //         name: `** Emoji Count ** `,
        //         value: ` \`${emojis.size}\``,
        //         inline: true
        //     }, {
        //         name: `** Regular Emoji Count **`,
        //         value: ` \`${emojis.filter(emoji => !emoji.animated).size}\``,
        //         inline: true
        //     }, {
        //         name: `** Animated Emoji Count** `,
        //         value: ` \`${emojis.filter(emoji => emoji.animated).size}\``,
        //         inline: true
        //     }, {
        //         name: `** Member Count **`,
        //         value: ` \`${message.guild.memberCount}\``,
        //         inline: true
        //     }, {
        //         name: `** Humans **`,
        //         value: ` \`${members.filter(member => !member.user.bot).size}\``,
        //         inline: true
        //     }, {
        //         name: `** Bots ** `,
        //         value: ` \`${members.filter(member => member.user.bot).size}\``,
        //         inline: true
        //     }, {
        //         name: `** Text Channels **`,
        //         value: ` \`${channels.filter(channel => channel.type === 'text').size}\``,
        //         inline: true
        //     }, {
        //         name: `** Voice Channels **`,
        //         value: ` \`${channels.filter(channel => channel.type === 'voice').size}\``,
        //         inline: true
        //     }, {
        //         name: `** Boost Count **`,
        //         value: ` \`${message.guild.premiumSubscriptionCount || '0'}\``,
        //         inline: true
        //     })
        //     .setTimestamp();

        // const Members = new MessageEmbed()
        //     .setTitle(`Statistic - ${message.guild.me.displayName}`)
        //     .setColor("BLUE")
        //     .setThumbnail(message.guild.iconURL({ dynamic: true }))
        //     .addFields({
        //         name: `** Online **`,
        //         value: ` \`${members.filter(member => member.presence.status === 'online').size}\``,
        //         inline: true
        //     }, {
        //         name: `** Idle **`,
        //         value: ` \`${members.filter(member => member.presence.status === 'idle').size}\``,
        //         inline: true
        //     }, {
        //         name: `** Do Not Disturb **`,
        //         value: ` \`${members.filter(member => member.presence.status === 'dnd').size}\``,
        //         inline: true
        //     }, {
        //         name: `** Offline ** `,
        //         value: ` \`${members.filter(member => member.presence.status === 'offline').size}\``,
        //         inline: true
        //     })

        // .setTimestamp();

        // const pages = [
        //     guild,
        //     roleses,
        //     Members
        // ]

        // const emojiList = ["⏪", "⏩"];

        // const timeout = '120000';

        // pagination(message, pages, emojiList, timeout)
    }
}