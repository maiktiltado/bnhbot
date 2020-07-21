const fs = require('fs')

module.exports = { 
    execute: message => {
        const {prefix} = require("../config.json");
        const command = message.content.split(prefix)[1].split(" ")[1]
        const fileToRemove = require(`../commands/${command}`);
        if(!fileToRemove) {
            message.reply("esse comando n existe :(")
            return;
        }
        if(!fileToRemove.byUser) {
            message.reply("você não pode excluir esse comando BRUH");
            return;
        }
        
        
        const path = __dirname + "/" + command + ".js"
        fs.unlink(path, err => {
            if (err) {
                message.reply("esse comando n existe :(")
            };

            message.react("👌")
        })
    }
}