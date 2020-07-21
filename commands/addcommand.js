const fs = require("fs");

module.exports = class AddCommand {    
    static execute(message) {
        const { prefix } = require("../config.json");
        const command = message.content.split(prefix)[1].split(" ")[0].toLowerCase()
        if(!message.content.split(`${prefix}${command} `)[1]) {
            message.reply(`a sintaxe correta é: ${prefix}addcommand <nome> <código>`)
            return;
        }
        const nome = message.content.split(`${prefix}${command} `)[1].split(" ")[0]
        if(!nome) {
            message.reply(`a sintaxe correta é: ${prefix}addcommand <nome> <código>`)
            return;
        }
        let content = message.content.split(`${prefix}${command} `)[1].split(nome + " ")[1]        
        if(!content) {
            message.reply(`a sintaxe correta é: ${prefix}addcommand <nome> <código>`)
            return;            
        }

        content = `module.exports = { execute: ${content}, byUser: true }`

        const path = __dirname + '/' + nome + '.js';        
        fs.exists(path, exists => {
            if(exists) {
                message.reply("esse comando já existe, ele não pode ser sobrescrito")
                return;
            } else {
                fs.writeFile(`${__dirname}/${nome}.js`, content, err => {
                    if(err) return console.log(err)

                    message.reply("comando criado, :)")
                })
            }
        })
    }
}