const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./token.json');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const db = require('quick.db');

const client = new Client({ intents: 3276799 });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`Commande "${file}" manque la propriété "data" ou "name" et ne sera pas enregistré.`);
    }
}

const rest = new REST({ version: '9' }).setToken(token);

async function deployCommands() {
    const commands = [];
    for (const command of client.commands.values()) {
        commands.push(command.data.toJSON());
    }

    try {
        console.log('Déploiement des commandes en progression...');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('Les commandes ont parfaitement était déployée !');
    } catch (error) {
        console.error('Une erreur a était rencontré lors du déploiement :', error);
    }
}

client.once('ready', () => {
    console.log(`Le bot ${client.user.tag} est désormais fonctoinnel ✅`);
    client.user.setStatus('idle');

    deployCommands();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Une erreur s\'est produite lors de l\'exécution de cette commande.', ephemeral: true });
    }
});

const vouchChannelId = '1134185070731722926'; // Remplace par l'id du channel "vouch"
const deleteDelay = 5000;

client.on('messageCreate', async (message) => {
  if (message.channel.id === vouchChannelId) {
    if (message.author.bot) return;

    const reply = await message.reply("S'il te plaît utilise le </vouch:1114910378829299782> commande pour donner ton optinion et non un message direct.");

    setTimeout(() => {
      message.delete().catch(console.error);
      reply.delete().catch(console.error);
    }, deleteDelay);
  }
});

client.login(token);