const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-verif')
        .setDescription('🛡️ Setup verification system')
        .addChannelOption(option => option.setName('channel').setDescription('Channel for verification message').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Role to be assigned after verification').setRequired(true)),
    async execute(interaction) {

        if (interaction.user.id !== '1109559949513732309') { // Met ton ID
            return await interaction.reply({ content: 'Vous n\'êtes pas autorisé à utiliser cette commande.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');

        if (!channel.isText()) {
            return await interaction.reply({ content: 'S\'il vous plaît choisissez un channel', ephemeral: true });
        }

        const embed = new MessageEmbed()
            .setTitle('Verification System')
            .setDescription('Ce serveur vous demande de vous vérifier pour accéder aux autres channels, veuillez exécuter la commande `/verify`.')
            .setColor('#68d19e')
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        const verificationMessage = await channel.send({ embeds: [embed] });

        db.set('verificationChannel', channel.id);
        db.set('verificationRole', role.id);
        db.set('verificationMessage', verificationMessage.id);

        await interaction.reply('Système de vérification mis en place avec succès.');
    },
};
