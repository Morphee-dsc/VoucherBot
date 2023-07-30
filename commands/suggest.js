const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('📈 Soumettre une suggestion')
        .addStringOption(option => option.setName('suggestion').setDescription('Ta suggestion').setRequired(true)),
    async execute(interaction) {
        const suggestion = interaction.options.getString('suggestion');

        db.push('suggestions', suggestion);

        const suggestionEmbed = new MessageEmbed()
            .setColor('#68d19e')
            .setTitle(`Suggestion donner par **${interaction.user.tag}**`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addField('Suggestion:', '```' + suggestion + '```')
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        const suggestionsChannel = interaction.guild.channels.cache.get('1134189509047758989');// Met l'id du salon suggest
        if (suggestionsChannel) {
            suggestionsChannel.send({ embeds: [suggestionEmbed] });
            await interaction.reply('Votre suggestion a été soumise avec succès. Merci!');
        } else {
            await interaction.reply('La chaîne de suggestions est introuvable. Merci de contacter l\'administrateur du serveur.');
        }
    },
};
