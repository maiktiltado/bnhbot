module.exports = { execute: message => { if(message.author.bot) { return; } else { message.channel.send("banido 🔫") } }, byUser: true }