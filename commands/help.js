const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const emojis = require('../emojis.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('✅ Affiche la liste des commandes disponibles.'),
    execute(interaction) {
        const mainEmbed = new MessageEmbed()
            .setColor('#68d19e')
            .setDescription(`Cliquez sur le bouton de votre choix pour afficher la page d'aide appropriée.`)
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        const helpButton = new MessageButton()
            .setCustomId('helpButton')
            .setLabel('Help Complet')
            .setStyle('SUCCESS');

        const buttonRow = new MessageActionRow().addComponents(helpButton);

        const interactionFilter = (i) => i.customId === 'helpButton';

        const collector = interaction.channel.createMessageComponentCollector({ interactionFilter, time: 15000 });

        collector.on('collect', (i) => {
            const replyEmbed = new MessageEmbed()
                .setColor('#68d19e')
                .setTitle('Commands available 📝')
                .setDescription(`Voici la liste des commandes disponibles.`)
                .addFields(
                    { name: `👑 Bot Owner - (2)`, value: `${emojis.dot} </setup-verify:1114883740074774593> *Setup verification system.*\n${emojis.dot} </customer:1114883740074774588> *Attribue le rôle Client.*` },
                    { name: `🔨 Administrator - (2)`, value: `${emojis.dot} </mass-role:1114883740074774590> *Ajoute ou enlève un rôles a tout les membres.*\n${emojis.dot} </nuke:1114883740074774591> *Nuke un channel.*` },
                    { name: `⭐ Customer - (1)`, value: `${emojis.dot} </vouch:1114910378829299782> *Donnez votre avis sur le service que vous avez acheté.*` },
                    { name: `🌐 Everyone - (4)`, value: `${emojis.dot} </help:1114881414299668531> *Affiche la liste des commandes disponibles.*\n${emojis.dot} </invite:1114883740074774589> *Créer une invitation pour le serveur.*\n${emojis.dot} </payment:1114883740074774592> *Affiche les options de paiement.*\n${emojis.dot} </suggest:1114883740074774594> *Soumettre une suggestion d'amélioration.*\n${emojis.dot} </verify:1114883740074774595> *Vérifiez-vous.*` },
                )
                .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
                .setTimestamp();

            i.reply({ embeds: [replyEmbed] });
            collector.stop();
        });

        interaction.reply({ embeds: [mainEmbed], components: [buttonRow] });
    },
};
