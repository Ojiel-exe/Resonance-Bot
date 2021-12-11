const config = require('../../config.json')

module.exports.run = async(client, guild) => {

    console.log(`${client.user.tag} Onlen`)

    const statuses = [{
        activity: `Master Ojiel.exe`,
        type: "WATCHING"
    },
    {
        activity: `Her Highness Prita`,
        type: "WATCHING"
    },
    {
        activity:` Master's Right Hands`,
        type: "WATCHING"
    },
    {
        activity: ` I'm WATCHING you`,
        type: "WATCHING"
    },
    {
        activity: ` Prita's Sound`,
        type: "LISTENING"
    },
    {
        activity: ` Collecting Human Souls`,
        type: "PLAYING"
    },
    {
        activity: ` Hide and Die`,
        type: "PLAYING"
    },
    {
        activity: ` Lets see how fast you can really go!`,
        type: "PLAYING"
    },
];
let random = statuses[Math.floor(Math.random() * Math.floor(statuses.length))];
client.user.setActivity(random.activity, {
    type: random.type,
});
setInterval(function() {
    client.users.cache.tap((coll) => (users = coll.size));
    client.guilds.cache.tap((coll) => (guilds = coll.size));
    random = statuses[Math.floor(Math.random() * Math.floor(statuses.length))];
    client.user.setActivity(random.activity, {
        type: random.type,
    });
}, 3000);
}