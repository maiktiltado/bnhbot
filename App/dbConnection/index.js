const mongoose = require('mongoose');

let url;
if(process.env.NODE_ENV === "production") {
    url = "mongodb+srv://admin:admin@discord-bot.rkm7y.mongodb.net/bot?retryWrites=true&w=majority"
} else {
    url = 'mongodb://localhost/test'
}

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = mongoose
