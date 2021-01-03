'use strict';
const Discord = require('discord.js');
require('dotenv').config();

// Loading discord token from .env file
// 
const envVariables = process.env;
const TOKEN = envVariables.TOKEN

const client = new Discord.Client();

const fs = require("fs");
let db = JSON.parse(fs.readFileSync("./database.json", "utf8"));


client.on('ready', () => {
	console.log('I am ready!');
});

client.on('guildMemberAdd', member => {

	const channel = member.guild.channels.find(channel => channel.name == "willkommen");
	if (!channel) return;

	channel.send(`Wilkommen auf dem Server ${member}, bitte lese dir die Regeln durch!`);

});

client.on('message', message => {

	let channel = message.channel;

	if (message.author.bot) return;
    if (!db[message.author.id]) db[message.author.id] = {
        xp: 0,
        level: 0
    };
    db[message.author.id].xp++;
    let userInfo = db[message.author.id];
    if (userInfo.xp > 15) {
        const user = message.mentions.user.first();
        userInfo.level++
        userInfo.xp = 0
        message.channel.send(`Glückwunsch ${user}, du bist ein Level aufgestiegen!`)
    }

    if (message.content.toLocaleLowerCase() == 'hlevel') {
        let userInfo = db[message.author.id];
        let member = message.mentions.members.first();
        let embed = new Discord.MessageEmbed()
            .setColor(0x4286f4)
            .setTitle(`${member}`)
            .addField("Dein Level:", userInfo.level)
            .addField("Deine XP", userInfo.xp + "/15");

        if (!member) return message.channel.send(embed)
        let memberInfo = db[member.id]
        let embed2 = new Discord.MessageEmbed()
            .setColor(0x4286f4)
            .addField("Level", memberInfo.level)
            .addField("XP", memberInfo.xp + "/100")
        message.channel.send(embed2)
    }
    fs.writeFile("./database.json", JSON.stringify(db), (x) => {
        if (x) console.error(x)
    });

// let score;
	// if (message.guild) {
	// 	score = client.getScore.get(message.author.id, message.guild.id);
	// 	if (!score) {
	// 		score = {
	// 			id: `${message.guild.id}-${message.author.id}`,
	// 			user: message.author.id,
	// 			guild: message.guild.id,
	// 			points: 0,
	// 			level: 1,
	// 		};
	// 	}

	// 	const xpAdd = Math.floor(Math.random() * 10) + 50;
	// 	const curxp = score.points;
	// 	const curlvl = score.level;
	// 	const nxtLvl = score.level * 100;
	// 	score.points = curxp + xpAdd;
	// 	if (nxtLvl <= curlvl) {
	// 		score.level = curlvl + 1;
	// 		const lvlup = new Discord.MessageEmbed()
	// 			.setAuthor(
	// 				`Glückwunsch ${message.author.username}`,
	// 				message.author.displayAvatarURL()
	// 			)
	// 			.setTitle("Du bist ein Level aufgestiegen!")
	// 			.setColor("Green")
	// 			.addField("Dein Level: ", curlvl + 1);
	// 		message.channel.send(lvlup)
	// 		client.setScore.run(score)
	// 	}
	// 	// if(message.content.toLowerCase() == 'hlevel') {
	// 	// 	let embed = new Discord.MessageEmbed()
	// 	// 		.setColor("RANDOM")
	// 	// 		.setTitle("Level")
	// 	// 		.setDescription("Infos zu deinem aktuellen Level")
	// 	// 		.addField("Dein Level", curlvl)
	// 	// 		.addField("Deine XP: ", curxp)
	// 	// }
	// }



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

	if (message.content.startsWith('hwarn')) {
		const user = message.mentions.user.first();
		if (user) {
			const member = message.guild.member(user);
			if (member) {
				member
					.console.warn('Spam')
					.then(() => {
						message.reply(`${user} wurde wegen Spam verwarnt`);
					})
					.catch(err => {
						message.reply(`${user} konnte nicht verwarnt werden`);
						console.error(err);
					});
			}
			else {
				message.reply('Dieser User ist nicht Mitglied dieses Servers.');
			}
		}
		else {
			message.reply('Welchen User möchtest du verwarnen?');
		}
	}
});

client.login(TOKEN);
