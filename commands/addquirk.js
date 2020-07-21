const quirkController = require('../App/controllers/quirkController.js')

module.exports = {
    PERMISSIONS: ["ADMINISTRATOR"],
    execute: async message => {
        const { prefix } = require("../config.json");
        const command = message.content.split(prefix)[1].split("addquirk ")[1]        
        const quirk = command.split("|")
        let quirkObj = {}
        const keys = ["nome", "descricao", "tipo", "defesa", "ataque", "dodge_chance"]
        
        quirk.forEach((e,i) => {        
            quirkObj[keys[i]] = e
        });

        await quirkController
            .add(quirkObj)
            .then(res => {
                message.react("👍")
            })
            .catch(err => {
                message.reply(err.message)
            })
        
    }
}