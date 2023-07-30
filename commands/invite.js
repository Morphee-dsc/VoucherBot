const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('📩 Créer une invitation pour le channel actuelle'),
    async execute(interaction) {
        const channel = interaction.channel;

        const invite = await channel.createInvite({
            maxUses: 50, // Maximum number of times the invitation can be used
            unique: true // Generates a new unique URL each time
        });

        const inviteEmbed = new MessageEmbed()
            .setTitle('Invite Created')
            .setDescription(`**Voici un lien d'invitation pour le channel actuelle:** ${invite.url}`)
            .setColor('#68d19e')
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({ embeds: [inviteEmbed] });
    },
};
