const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('✅ Vérifie-toi'),
    async execute(interaction) {
        const verificationChannelId = db.get('verificationChannel');
        const verificationRoleId = db.get('verificationRole');
        const verificationMessageId = db.get('verificationMessage');

        if (!verificationChannelId || !verificationRoleId || !verificationMessageId) {
            return await interaction.reply({ content: 'Le système de vérification n\'est pas mis en place.', ephemeral: true });
        }

        if (interaction.channelId !== verificationChannelId) {
            return await interaction.reply({ content: 'Veuillez exécuter la commande `/verify` dans le canal de vérification désigné.', ephemeral: true });
        }

        const member = interaction.member;
        const role = interaction.guild.roles.cache.get(verificationRoleId);

        if (!role) {
            return await interaction.reply({ content: 'Le rôle de vérification n\'existe pas.', ephemeral: true });
        }

        if (member.roles.cache.has(verificationRoleId)) {
            return await interaction.reply({ content: 'Vous êtes déjà vérifié.', ephemeral: true });
        }

        await member.roles.add(role);

        const dmEmbed = new MessageEmbed()
            .setTitle('Verification Successful')
            .setDescription('Vous avez réussi la vérification.')
            .setColor('#68d19e')
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        try {
            await interaction.reply({ content: 'Vérification réussie. Bienvenue!', ephemeral: true });
            await interaction.user.send({ embeds: [dmEmbed] });
        } catch (error) {
            console.error(`Échec de l'envoi du DM à l'utilisateur ${interaction.user.tag}:`, error);
        }
    },
};
