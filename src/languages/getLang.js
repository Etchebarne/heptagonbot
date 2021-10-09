module.exports.getLang = function (language, category, command, string, ...vars) {
	try{
		let jsonFile = require("./data/"+language+"/"+category+".json");
		let locale = jsonFile[command][string];
		locale = locale.replace(/%VAR%/g, () => vars[0] !== null ? vars[0] : "%VAR%");
		return locale;
	} catch(err) { console.log(err) }
}