const User = require("../models/users.js")

module.exports = {
    add: async data => {
        return new Promise(async (resolve, reject) => {
            try {
                const { userId, quirks } = data

                const user = User.create({
                    lastQuirk: new Date(),
                    userId,
                    quirks
                })

                resolve(user);
            } catch(err) {
                reject(err)
            }
        })
    },
    get: async userId => {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.find({ userId: userId })

                resolve(user)
            } catch(err) {
                reject(err)
            }
        })
    },
    updateLasQuirk: async userId => {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOneAndUpdate({ userId: userId }, { lastQuirk: new Date() })

                resolve(user)
            } catch(err) {
                reject(err)
            }
        })
    }
}