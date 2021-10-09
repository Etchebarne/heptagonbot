const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
const colors = require("../../utils/colors.json");
const lang = require("../../languages/getLang.js");
const guildConfig = require("../../database/models/guildConfigSchema.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(client, interaction) {
		var guildData = await guildConfig.findOne({guildID: interaction.guild.id});

		var latency = `${Date.now() - interaction.createdTimestamp}`;
		var apiLatency = `${Math.round(client.ws.ping)}`;

		var embed = new MessageEmbed()
			.setColor(colors.theme)
			.setDescription("**🏓 Pong!**\n\n"+emoteIndicator(latency)+" "+lang.getLang(guildData.language, "commands", "ping", "ping", latency)+emoteIndicator(apiLatency)+" "+lang.getLang(guildData.language, "commands", "ping", "apiPing", apiLatency))
		interaction.reply({embeds: [embed]});

		function emoteIndicator(n){
			var emoteStatus;
			if(n <= 99){
			emoteStatus = "🟢";
			} else if(n > 99 && n <= 199){
				emoteStatus = "🟡";
			} else if(n > 199){
				emoteStatus = "🔴";
			}
			return emoteStatus;
		}
	},
};