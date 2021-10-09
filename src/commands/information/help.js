const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const path = require("path");
const colors = require("../../utils/colors.json");
const lang = require("../../languages/getLang.js");
const guildConfig = require("../../database/models/guildConfigSchema.js");
const commandFiles = fs.readdirSync(path.join(__dirname)).filter(file => file.endsWith(".js"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows the command list.'),
	async execute(client, interaction) {
		var commandsArray = [];
		var hiddenCommands = [""];

		// LIST ALL COMMANDS IN THE COMMANDS ARRAY
		const commandDir = path.join("/home/runner/Heptagon/src/commands");
		fs.readdirSync(commandDir).forEach(dirs => {
			const commands = fs.readdirSync(`${commandDir}${path.sep}${dirs}${path.sep}`)
				.filter(files => files.endsWith(".js"));
			for (const file of commands){
				const cmd = require(`${commandDir}/${dirs}/${file}`);
				commandsArray.push(cmd.data.name);
			}
		});

		// REMOVING HIDDEN COMMANDS FROM THE COMMANDS ARRAY
		for(let i = 0; i < commandsArray.length; i++){
			if(hiddenCommands.includes(commandsArray[i])){
				commandsArray.splice(i, 1);
			}
		}

		// SAVE COMMAND NAMES IN A STRING
		var commandsString = "";
		for(let i = 0; i < commandsArray.length; i++){
			if(i == commandsArray.length - 1){
				commandsString = commandsString + "`" + commandsArray[i] + "`.";
			} else {
				commandsString = commandsString + "`" + commandsArray[i] + "`, ";
			}
		}

		// SEND EMBED MESSAGE
		var guildData = await guildConfig.findOne({guildID: interaction.guild.id});
		var embed = new MessageEmbed()
			.setColor(colors.theme)
			.setTitle(lang.getLang(guildData.language, "commands", "help", "needsHelp", interaction.user.username))
			.setDescription(lang.getLang(guildData.language, "commands", "help", "commandList", commandsString))
		interaction.reply({ embeds: [embed] });
	},
};