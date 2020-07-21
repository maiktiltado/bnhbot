const Quirk = require("../models/quirks.js")

module.exports = {
    add: async data => {
        return new Promise(async (resolve, reject) => {
            try {
                const {nome, descricao, tipo, defesa, ataque, dodge_chance} = data;
                    
                const quirk = await Quirk.create({
                    nome,
                    descricao,
                    tipo,
                    defesa,
                    ataque,
                    dodge_chance
                })
                
                resolve(quirk);
            } catch(err) {
                reject(err);
            }
        })
    },
    get: async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const quirk = await Quirk.find({});

                resolve(quirk)
            } catch(err) {
                reject(err)
            }
        })
    }
}