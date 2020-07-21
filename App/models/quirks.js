const mongoose = require("../dbConnection");

const Quirk = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    descricao: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ["Emissão", "Transformação", "Mutação"]
    },
    defesa: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    ataque: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    dodge_chance: {
        type: Number,
        required: true
    }
});

Quirk.pre('validate', function (next) {
    var self = this;

    mongoose.models["Quirk"].findOne({ nome: self.nome }, (err, results) => {
        if(err) next(err)

        if(results) {             
            next(new Error("essa individualidade já existe bro"))
        } else {
            next();            
        }
    })    
})

const quirkModel = mongoose.model("Quirk", Quirk, "quirk");

module.exports = quirkModel;