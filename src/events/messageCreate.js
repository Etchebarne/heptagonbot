const dataRegistration = require("../database/dataRegistration.js");

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(msg, client) {
		await dataRegistration.guildConfigCreation(msg.guild.id);
	},
};