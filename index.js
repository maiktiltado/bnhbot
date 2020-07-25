const Discord = require("discord.js")
require("dotenv").config();
const client = new Discord.Client()
const fs = require('fs')

const Bot = require('./util.js')

let commands = [];
var bot = new Bot();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  await fs.readdir("./commands/", (err, files) => {
    commands = files.map(el => el.split('.')[0])    
  })  
});

client.on('message', async message => {  
  if(!message.content.startsWith(process.env.prefix)) return;
  const command = message.content.split(process.env.prefix)[1].split(" ")[0].toLowerCase()
  if(commands.indexOf(command) === -1) {
    message.reply("Use o comando certo cara...");
    return;    
  }
  
  bot.read(message, command).then(res => {
    console.log(`${res} está executando o comando ${command}`)
  })
  .catch(err => {
    if(err === "NO PERM") {
      message.reply("sem permissão pra isso camarada.")
      return;
    }
    console.log(err);
    return;
  })
  
})

client.login(process.env.token);