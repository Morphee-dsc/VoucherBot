const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vouch')
        .setDescription('📈 Donnez votre avis sur le service que vous avez acheté')
        .addUserOption(option => option.setName('member').setDescription('Le membre concerné').setRequired(true))
        .addStringOption(option => option.setName('service').setDescription('Le service concerné').setRequired(true))
        .addIntegerOption(option => option.setName('note').setDescription('Le score doit être compris entre 1 et 5').setRequired(true))
        .addStringOption(option => option.setName('reviews').setDescription('Votre opinion').setRequired(true))
        .addStringOption(option => option.setName('image').setDescription('Image URL').setRequired(false)),
    async execute(interaction) {
        const member = interaction.options.getUser('member');
        const service = interaction.options.getString('service');
        const note = interaction.options.getInteger('note');
        const reviews = interaction.options.getString('reviews');
        const image = interaction.options.getString('image');

        if (note < 1 || note > 5) {
            return await interaction.reply({ content: 'Le score doit être compris entre 1 et 5', ephemeral: true });
        }

        if (member.id !== '1109559949513732309') { // met ton id
            return await interaction.reply({ content: 'Seulement <@1109559949513732309> peut vouch.', ephemeral: true });
        }

        const requiredRole = '1134185522588291112'; 
        if (!interaction.member.roles.cache.has(requiredRole)) {
            return await interaction.reply({ content: 'Seuls les membres ayant le rôle requis peuvent utiliser cette commande.', ephemeral: true });
        }

        const vouchData = {
            member: member.id,
            service,
            note,
            reviews,
            image,
            reviewer: interaction.user.id
        };

        db.push('vouches', vouchData);

        const avisEmbed = new MessageEmbed()
            .setTitle(`Commentaires donner par **${interaction.user.tag}**`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addField('Membre:', member.toString(), false)
            .addField('Service:', service, false)
            .addField('Note:', '⭐'.repeat(note), true)
            .addField('Commentaires:', reviews, false)
            .setColor('#68d19e')
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        if (image) {
            avisEmbed.setImage(image);
        }

        const avisChannel = interaction.guild.channels.cache.get('1134190178865533039');//Met l'id du channel avis
        if (avisChannel) {
            avisChannel.send({ embeds: [avisEmbed] });
            await interaction.reply({ content: 'Votre avis a été envoyé avec succès.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'The notification channel was not found. Please contact <@1109559949513732309>.', ephemeral: true });//met ton id
        }
    },
};