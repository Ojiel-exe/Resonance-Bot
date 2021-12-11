const { readdirSync } = require('fs')
const ascii = require('ascii-table')

const table = new ascii().setHeading("Command", "loading", "Ready");

module.exports = (client) => {
    readdirSync('./commands/').forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'))

        for(let file of commands){
            let pull =  require(`../commands/${dir}/${file}`);

            if(pull.name){
                client.commands.set(pull.name, pull);
                table.addRow(file, `✅ : Loaded!`)
            } else {
                table.addRow(file, `❌ : Error Code Check Again!`)
                continue;
            }

            if(pull.aliases && Array.isArray(pull)){
                pull.allases.forEach(alias => 
                    client.aliases.set(alias, pull.name)
                )
            }
        }
      })
    console.log(table.toString())

}