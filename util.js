module.exports = class Bot {
	read(message, command) {
		return new Promise((resolve, reject) => {			
			const exc = require(`./commands/${command}.js`)				
			if(exc.PERMISSIONS) {				
				if(!message.member.hasPermission(exc.PERMISSIONS)) reject('NO PERM')
			}
			if(!exc.execute) reject("Função execute não encontrada")
			exc.execute(message)
						
			resolve(message.author.username)
		})
	}
}