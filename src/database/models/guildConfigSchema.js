const mongoose = require("mongoose");

const guildConfigSchema = new mongoose.Schema({
	guildID: { type: String, require: true, unique: true },
	language: { type: String }
});

module.exports = mongoose.model("guildConfig", guildConfigSchema);