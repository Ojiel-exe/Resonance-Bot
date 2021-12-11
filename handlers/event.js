const { readdirSync } = require('fs')
const ascii = require('ascii-table')

let table = new ascii('Events')
table.setHeading('Event','Status')

module.exports = (client) => {
    const load = dirs => {
            const events = readdirSync(`./events/${dirs}`).filter(file =>
                file.endsWith('.js')
            )
            for (let file of events) {
                try {
                    let pull = require(`../events/${dirs}/${file}`);
                    if (pull.event && typeof pull.event !== "string") {
                        table.addRow(file, `❌ : Event File Must Be String!`)
                        continue;
                    }
                    pull.event = pull.event || file.replace(".js", "");
                    client.on(pull.event, pull.run.bind(null, client));
                    table.addRow(file, `✅ : Loaded!`);
                } catch (err) {
                    console.log("");
                    console.log(err);
                    table.addRow(file, `❌ : Error Code Check Again!`)
                }
            }
            console.log(table.toString());

        }
        ["client", "guild"].forEach(x => load(x))
}