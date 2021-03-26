'use strict';
const Discord = require('discord.js');
require('dotenv').config();

// Loading discord token from .env file
const envVariables = process.env;
const TOKEN = envVariables.TOKEN;

const client = new Discord.Client(); // Create Discord client for connection to Discord


const fs = require("fs");
let db = JSON.parse(fs.readFileSync("./database.json", "utf8"));

client.on('ready', () => {
	console.log('I am ready!');

	//Setting a custom Status for my Bot
	client.user.setActivity("hHelp | discord.gg/UrqjArnp", {  //In the "" can be anything you like
		type: "PLAYING"
	});

});

client.on('guildMemberAdd', member => {

    let welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome')

	// let servericon = guild.iconURL();
    let embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle(`Willkommen auf dem Server ${member.user.username}`)
        .addField("Die Regeln findest du hier:", '<#735111514784006185>')
        .addField("Custom Rollen kannst du dir hier abholen:", '<#735132918833479761>')
        .addField("Hier kannst du dich vorstellen:", '<#735114521567297536>')
		.setImage('https://cdn.discordapp.com/attachments/798613344809779252/808372720957652992/hitman.gif')
		.setThumbnail('https://cdn.discordapp.com/attachments/754068965818630145/808384711582941255/all_around_gaming_icon.jpg')
        .addField("**Viel Spaß auf dem Server!**", '~Server Team')
            
    welcomeChannel.send(embed)

});

client.on('message', message => {

	let channel = message.channel;
		
	if (message.content.toLowerCase() == 'hhelp') {
		let embed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Hilfe")
			.setDescription('Eine Liste aller Befehle des Hydrablades Bots')
			.addField("hServerInvite", 'Erstellt eine eine Einladung für diesen Server.')
			.addField("hInvite", 'Generiert den Einladungslink für den Hydrablades Bot, um ihn auf deinen eigenen Server einzuladen.')
			.addField("hServerInfo", 'Alle wichtigen Informationen über diesen Server.')
			.addField("hInfo", 'Alle relevanten Infos über den Hydrablades Bot.')
			.addField("hLevel", 'Euer aktuelles Level und eure XP')
			.addField("hVorschlag", 'Gibt euch den Link zu einem Google Docs Dokument in welches ihr Vorschläge für den Bot schreiben könnt')
			.addField("hKick", 'Kickt Mitglieder des Servers (Nur Personen mit Moderationsberechtigungen).')
		
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

	if(message.content.toLowerCase() == 'hvorschlag') {
		let embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Hier könnt ihr Vorschläge für den Bot da lassen")
			.setURL("https://docs.google.com/document/d/1iay2mCh7vIv05IoZU1tY-2VgKYP3XkkOv2Wm4pny75I/edit?usp=sharing")
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
			.addField("Bot Version", 'v1.4.0')
			.addField("Source Code", "https://github.com/Hydrablades/Discord-Bot")
			.addField("Discord.js Version", 'v12')
			.addField("Node.js Version", "v14.15.0")
			.addField("Hilfe", 'Hilfe zu den Befehlen des Hydrablades Bots bekommst du mit hHelp.')

		message.channel.send(embed)
	}

	if (!message.guild) return;
	if (message.content.toLowerCase() == 'hkick') {
		
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

	if(message.content.toLowerCase() == 'htest') {
        
        let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .addField("Test", 'Test 1 bestanden')
            
        message.channel.send(embed)
    }

});


// And finally connect to Discord
// 
client.login(TOKEN);
