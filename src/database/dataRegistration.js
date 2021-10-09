// SCHEMAS
const guildConfig = require("./models/guildConfigSchema.js");

// GUILD CONFIG
async function guildConfigCreation(id){
	let guildData;
	try{
		guildData = await guildConfig.findOne({guildID: id});
		if(!guildData){
			const guild = new guildConfig({
				guildID: id,
				language: "en"
			});
			await guild.save().catch(err => console.log(err));
		}
	} catch(err) { console.log(err) }
}

module.exports = { guildConfigCreation };