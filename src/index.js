// DISCORD
const { Client, Collection, Intents } = require("discord.js");

// DISCORD CLIENT
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.commands = new Collection();

// DEPENDENCIES
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// DIRECTORIES
const commandDir = path.join(__dirname + "/commands");
const eventDir = path.join(__dirname + "/events");

// COMMAND HANDLER
fs.readdirSync(commandDir).forEach(dirs => {
	const commands = fs.readdirSync(`${commandDir}${path.sep}${dirs}${path.sep}`)
		.filter(files => files.endsWith(".js"));
	for (const file of commands){
		const pull = require(`${commandDir}/${dirs}/${file}`);
		client.commands.set(pull.data.name, pull);
	}
})

// EVENT HANDLER
const eventFiles = fs.readdirSync(eventDir)
	.filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// MONGOOSE CONNECTION
mongoose.connect(process.env.MONGODB, {
	useUnifiedTopology: true, 
	useNewUrlParser: true
}).then(() => {
	console.log("Connected to the database.");
}).catch((err) => {
	console.log(err);
});

// BOT LOGIN
client.login(process.env.TOKEN);