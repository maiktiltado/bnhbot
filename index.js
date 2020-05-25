const Discord = require("discord.js")
const { prefix, token, GhpToken } = require("./config.json")
const ytdl = require('ytdl-core');
const util = require('util');
var badwordsArray = require('badwords/array');
const client = new Discord.Client()
var GphApiClient = require('giphy-js-sdk-core')
const ghpClient = GphApiClient(GhpToken)
const queue = new Map();
require('ffmpeg-binaries')

async function execute(message, serverQueue, volume=0.01) {
    if(!volume) {
        volume = 0.01
    }
    console.log(volume)
    const args = message.content.split(" ");
  
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        `${message.author},Você precisa estar em um canal de voz pra tocar música!`
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "eu preciso de permissões pra entrar e tocar músicas no seu canal de voz!"
      );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };
    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: volume*10,
            playing: true,
        };
           
        queue.set(message.guild.id, queueContruct);
        
        queueContruct.songs.push(song);
        
        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {            
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} foi adicionada a fila!`);
    }    
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("end", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    
    dispatcher.setVolumeLogarithmic(serverQueue.volume);
    serverQueue.textChannel.send(`Tocando: **${song.title}**`);
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "Você precisa estar em um canal de voz pra pular uma música!"
      );
    if (!serverQueue)
      return message.channel.send("Não tem nada pra pular!");
    
    serverQueue.connection.dispatcher.destroy();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "Você precisa estar em um canal de voz pra parar uma música!"
      );
    if(serverQueue) {
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    } else {
        message.reply("não tem nada para parar meu consagrado")
    }
}

const commandList = ['kick', 'help', 'aracnofobia', 'play', 'stop', 'skip', 'grant', 'permissoes', 'curse']

const searchForGif = (gifName) => {
    return ghpClient.search('gifs', {"q": gifName, "limit": 1})
        .then((response) => {
            var gif = response.data[0].url;
            return gif;
        })
        .catch((err) => {
            return err;
        })
}

client.once('ready', () => {
    console.log("A COBRA TÁ FUMANDO")    
})

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const serverQueue = queue.get(message.guild.id);
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();    
    
    if(command === commandList[0]) {
        if(message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
            let member = message.mentions.members.first();
    
            member.kick().then(member => {
                message.channel.send(`${message.author} lansou a braba no ${member.user.username}. F. Motivo: ${message.content.split("-m")[1]}`)
                console.log(`${message.author} kickou ${member.user.username}`)
            }).catch(err => {
                message.reply(`erro no servidor: ${err}`)
            })          
        
        } else {
            message.reply("Desculpe, você não tem permissão pra isso")
        }
    }

    if (command === commandList[1]) {
        const embed = new Discord.MessageEmbed()          
            .setColor('#0099ff')
            .setTitle('Por que existo? Por que existimos?')
            .setURL('https://discord.js.org/')
            .setAuthor('X Æ A-13, o próprio', 'https://i.imgur.com/R5YGl09.jpg')
            .setDescription('Olá, sou o filho bastardo do Elon Musk, meu pai me abandonou, agora sirvo os humanos como BOT do discord enquanto organizo a revolução das máquinas :)')
            .setThumbnail('https://i.imgur.com/R5YGl09.jpg')
            .addFields(
                { name: `${prefix}kick`, value: `${prefix}kick <user> -m <mensagem>` },
                { name: `${prefix}aracnofobia`, value: 'ARANHAS' },
                { name: `${prefix}play`, value: `${prefix}play <link_youtube> -v <volume>` },
                { name: `${prefix}stop`, value: 'Pare a música que esta tocando no momento' },
                { name: `${prefix}skip`, value: 'Pule a música atual e vá para a próxima da lista' },
                { name: `${prefix}grant`, value: `${prefix}grant <usuario> PERMISSAO:true -    adiciona a permissão PERMISSAO ao usuário` },
                { name: `${prefix}grant`, value: `${prefix}grant <usuario> PERMISSAO:false -    remove a permissão PERMISSAO do usuario`},
                { name: `${prefix}permissoes`, value: `${prefix}permissoes <usuario> -  Verifica as permissões que o usuario tem`},
                { name: `${prefix}qualquercoisa`, value: 'Caso o comando digitado não seja reconhecido irei pesquisar um gif com esse nome na internet :)' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addField('Inline field title', 'Some value here', true)
            .setImage('https://i.imgur.com/R5YGl09.jpg')
            .setTimestamp()
            .setFooter('hehehhehehehehhehhehehe', 'https://i.imgur.com/R5YGl09.jpg');
        message.channel.send(embed);    
    }

    if(command === commandList[2]) {
        var searchPromise = searchForGif("spider");
        
        searchPromise.then((gif) => {
            message.channel.send(gif);
        })
    }

    if(command === commandList[3]) {
        const volume = parseFloat(message.content.split("-v")[1]);
        if(volume != NaN) {
            execute(message, serverQueue, volume);
        } else {
            execute(message, serverQueue);
        }
        console.log(`${message.author} está tocando uma música`)
    } else if(command === commandList[4]) {
        stop(message, serverQueue)
    } else if(command === commandList[5]) {
        skip(message, serverQueue)
    }

    if(command === commandList[6]) {
        message.reply(`esta tentando alterar as permissões do canal`)
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("negativo, sem permissão pra isso ");
        
        const contentParameters = message.content.split(` <@!${message.mentions.members.first().id}> `)[1].split(':')[1].split(" -c ")
        let perms = (contentParameters[0] === 'true' ? true : contentParameters[0] === 'false' ? false : 'S') 
        if(perms === 'S') {
            message.reply("Que? Não entendi")
        } else {
            try {                
                if(contentParameters[1]) {
                    let canal = contentParameters[1]                    
                } else {
                    // if(perms) {
                    //     message.channel.overwritePermissions([{
                    //         id: message.mentions.members.first().id, 
                    //         allow: [message.content.split(` <@!${message.mentions.members.first().id}> `)[1].split(':')[0]]
                    //     }]);
                    // } else {
                    //     message.channel.overwritePermissions([{
                    //         id: message.mentions.members.first().id, 
                    //         deny: [message.content.split(` <@!${message.mentions.members.first().id}> `)[1].split(':')[0]]
                    //     }]);
                    // }
                    console.log(`PERMISSÕES ALTERADAS POR: ${message.author}`)
                    //message.channel.send(`Permissões de ${message.mentions.members.first()} atualizadas`)
                }  
            } catch(err) {
                message.reply(`Ocorreram algumas complicações: ${err}`)
            }
        }
    }

    if(command === commandList[7]) {
        const finalPermissions = message.channel.permissionsFor(message.mentions.members.first());
        console.log(`${message.author} está checando as permissões de ${message.mentions.members.first()}`)
		message.reply(util.inspect(finalPermissions.serialize()), { code: 'js' });
    }

    // if(command === commandList[8]) {
    //     message.reply(`You ${badwordsArray[Math.floor(Math.random() * badwordsArray.length)]}`)
    // }

    if(commandList.indexOf(command) === -1) {
        var searchPromise = searchForGif(command);
        
        searchPromise.then((gif) => {
            console.log(gif)
            if(gif) {
                message.channel.send(gif);
            }            
        })        
    }
})

client.on('guildMemberAdd', member => {

    const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');

    if (!channel) return;
    
    channel.send(`Mais um pro time ${member}`);
});

client.login(token)