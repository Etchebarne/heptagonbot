const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions, MessageActionRow, MessageSelectMenu } = require("discord.js");
const fs = require("fs");
const path = require("path");
const colors = require("../../utils/colors.json");
const lang = require("../../languages/getLang.js");
const guildConfig = require("../../database/models/guildConfigSchema.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('language')
		.setDescription('Changes the bot language on the current server.'),
	async execute(client, interaction) {
		var guildData = await guildConfig.findOne({guildID: interaction.guild.id});

		// DON'T HAVE PERMISSION TO EXECUTE THE COMMAND
		if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return interaction.reply({content: lang.getLang(guildData.language, "commands", "language", "cantChangeLang"), ephemeral: true});

		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId("langSelection")
				.setPlaceholder(lang.getLang(guildData.language, "commands", "language", "chooseLanguage"))
				.addOptions({
					label: "English - en",
					description: "I will speak in english.",
					value: "en",
					emoji: "🇺🇸"
				},
				{
					label: "Spanish - es",
					description: "Hablaré en español.",
					value: "es",
					emoji: "🇪🇸"
				})
		)

		const embed = new MessageEmbed().setTitle(lang.getLang(guildData.language, "commands", "language", "chooseLanguage")).setColor(colors.theme)

		const filter = (int) =>
			int.isSelectMenu &&
			int.user.id === interaction.user.id;

		const collector = interaction.channel.createMessageComponentCollector({
			filter,
			max: 1
		});

		collector.on("collect", async(collected) => {
			const value = collected.values[0];
			var guildData = await guildConfig.findOne({guildID: interaction.guild.id});
			guildData.language = await value;
			await guildData.save().catch(err => console.log(err));

			var changedLangEmbed = new MessageEmbed()
				.setColor(colors.green)
				.setTitle(lang.getLang(guildData.language, "commands", "language", "languageUpdated"))
				.setDescription(lang.getLang(guildData.language, "commands", "language", "speakIn", value))
			await collected.channel.send({ embeds: [changedLangEmbed] })
		});

		interaction.reply({ embeds: [embed], components: [row] });
	},
};