'use strict';
const Discord = require('discord.js');
require('dotenv').config();

// Loading discord token from .env file
const envVariables = process.env;
const TOKEN = envVariables.TOKEN


const client = new Discord.Client(); // Create Discord client for connection to Discord


const fs = require("fs");
let db = JSON.parse(fs.readFileSync("./database.json", "utf8"));

client.on('ready', () => {
	console.log('I am ready!');
});



client.on('message', message => {

	client.on('guildMemberAdd', member => {

		const channel = member.guild.channels.find(channel => channel.name == "willkommen");
		if (!channel) return;
	
		channel.send(`Wilkommen auf dem Server ${member}, bitte lese dir die Regeln durch!`);
	
	});

	let channel = message.channel;
	const user = message.mentions.users.first();

	if(message.author.bot) return;
    if(!db[message.author.id]) db[message.author.id] = {

        xp: 0,
        level: 0,

    };

    db[message.author.id].xp + Math.floor(Math.random() *10) +50
    let userInfo = db[message.author.id];
    if(userInfo.xp > 100) {
        
        userInfo.level++
        userInfo.xp = 0
        message.channel.send(`Glückwunsch, du bist ein Level aufgestiegen!`);

    }

    if(message.content.toLowerCase() == 'hlevel') {

        let userInfo = db[message.author.id];
        let embed = new Discord.MessageEmbed()
            .setColor("WHITE")
            .setTitle(`${user}`)
            .addField("Dein Level", userInfo.level)
            .addField("Deine XP", userInfo.xp + "/100")
        message.channel.send(embed)

	}
	

    fs.writeFile("./database.json", JSON.stringify(db), (x) => {
        if (x) console.error(X)
    });

	if (message.content.toLowerCase() == 'hhelp') {
		let embed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Hilfe")
			.setDescription('Eine Liste aller Befehle des Hydrablades Bots')
			.addField("hServerInvite", 'Erstellt eine eine Einladung für diesen Server.')
			.addField("hInvite", 'Generiert den Einladungslink für den Hydrablades Bot, um ihn auf deinen eigenen Server einzuladen.')
			.addField("hServerInfo", 'Alle wichtigen Informationen über diesen Server.')
			.addField("hInfo", 'Alle relevanten Infos über den Hydrablades Bot.')
			.addField("hKick", 'Kickt Mitglieder des Servers (Nur Personen mit Moderationsberechtigungen).')
		//  .addField("hCredits", 'With friendly support of best daddy on earth')
		message.channel.send(embed)
	}

	if (!message.guild) return;
	if (message.content.toLowerCase() == 'hserverinvite') {
		channel.createInvite({ unique: true })
			.then(invite => {
				let embed = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setTitle("Einladungslink für diesen Server")
					.setDescription("Hier ist dein Einladungsklink für diesen Server: https://discord.gg/" + invite.code)
				message.channel.send(embed)
			}
			)
	}

	if (message.content.toLowerCase() == 'hinvite') {
		let embed = new Discord.MessageEmbed()
			.setColor("YELLOW")
			.setTitle("Dein Einladungslink um den Bot auf deinen Server zu holen")
			.setURL("https://discord.com/api/oauth2/authorize?client_id=726742234652737626&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A53134&scope=bot")
		message.channel.send(embed)
	};

	if (message.content.toLowerCase() == 'hserverinfo') {
		let embed = new Discord.MessageEmbed()
			.setColor("DARKBLUE")
			.setTitle("Server Info")
			.setImage(message.guild.iconURL)
			.setDescription(`${message.guild}'s Informationen:`)
			.addField("Owner", `Der Serverowner ist ${message.guild.owner}.`)
			.addField("Member Count", `Dieser Server hat ${message.guild.memberCount} Mitglieder.`)
			.addField("Emoji Count", `Dieser Server hat ${message.guild.emojis.cache.size} Emojis.`)
			.addField("Roles Count", `Dieser Server hat ${message.guild.roles.cache.size} Rollen.`)
			.addField("Channel Count", `Dieser Server hat ${message.guild.channels.cache.size} Kanäle.`)

		message.channel.send(embed)
	}

	if (message.content.toLowerCase() == 'hinfo') {
		let embed = new Discord.MessageEmbed()
			.setColor("BLUE")
			.setTitle("Über Hydrablades")
			.setDescription('Alle wichtigen Infos über den Hydrablades Bot.')
			.addField("Bot Version", 'Beta 1.0.0')
			.addField("Source Code", "https://github.com/Hydrablades/Discord-Bot")
			.addField("Discord.js Version", 'V12')
			.addField("Node.js Version", "v14.15.0")
			.addField("Hilfe", 'Hilfe zu den Befehlen des Hydrablades Bots bekommst du mit hHelp.')
		message.channel.send(embed)
	}

	if (!message.guild) return;
	if (message.content.toLowerCase() == 'hkick') {
		const user = message.mentions.users.first();
		if (user) {
			const member = message.guild.member(user);
			if (member) {
				member
					.kick('Optionaler Grund für den Audit-log.')
					.then(() => {

						message.reply(`${user} wurde erfolgreich gekickt`);
					})
					.catch(err => {

						message.reply(`${user} konnte nicht gekickt werden.`);

						console.error(err);
					});
			}
			else {
				message.reply('Dieser User ist nicht auf dem Server.');
			}
		}
		else {
			message.reply('Wen willst du kicken?');
		}
	}

});


// And finally connect to Discord
// 
client.login(TOKEN);
