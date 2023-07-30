const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('📊 Afficher le profil d\'un membre')
        .addUserOption(option => option.setName('member').setDescription('Pour afficher le profil d\'un membre').setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getUser('member');
        
        if (member.id !== '1109559949513732309') { // Met ton ID
            return await interaction.reply({ content: 'You can display only the profile of <@1109559949513732309>', ephemeral: true });// Met ton ID
        }

        const vouches = db.get('vouches') || [];

        const memberVouches = vouches.filter(vouch => vouch.member === member.id);

        if (memberVouches.length === 0) {
            return await interaction.reply({ content: 'Aucune vouch trouvé pour ce membre.', ephemeral: true });
        }

        const maxVouchesPerPage = 1;
        const maxPages = Math.ceil(memberVouches.length / maxVouchesPerPage);
        let currentPage = 1;
        let vouchIndex = (currentPage - 1) * maxVouchesPerPage;
        let vouch = memberVouches.slice(vouchIndex, vouchIndex + maxVouchesPerPage);

        const embed = new MessageEmbed()
            .setTitle(`Vouch Profile de ${member.tag}`)
            .setDescription(`Total Vouches: **${memberVouches.length}** ⭐`)
            .addField('Membre:', `<@${interaction.guild.members.cache.get(vouch[0].reviewer).id}>`, false)
            .addField('Commentaires:', vouch[0].reviews, true)
            .setThumbnail(interaction.guild.members.cache.get(vouch[0].reviewer).user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setColor('#68d19e')
            .setFooter(`Page ${currentPage} of ${maxPages}`)
            .setTimestamp();

        const previousButton = new MessageButton()
            .setCustomId('previous')
            .setLabel('◀')
            .setStyle('SUCCESS')
            .setDisabled(currentPage === 1);

        const nextButton = new MessageButton()
            .setCustomId('next')
            .setLabel('▶')
            .setStyle('SUCCESS')
            .setDisabled(currentPage === maxPages);

        const homeButton = new MessageButton()
            .setCustomId('home')
            .setLabel('🏠')
            .setStyle('SUCCESS')
            .setDisabled(currentPage === 1);

        const buttonRow = new MessageActionRow().addComponents(previousButton, nextButton, homeButton);

        const message = await interaction.reply({ embeds: [embed], components: [buttonRow], fetchReply: true });
        const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });

        collector.on('collect', async interaction => {
            if (interaction.user.id !== interaction.guild.me.id) {
                interaction.deferUpdate();
                if (interaction.customId === 'previous') {
                    await showPreviousVouch();
                } else if (interaction.customId === 'next') {
                    await showNextVouch();
                } else if (interaction.customId === 'home') {
                    await showFirstVouch();
                }
            }
        });

        const buttonInteractionCollector = message.createMessageComponentCollector({ componentType: 'BUTTON' });
        let buttonInteractionTimeout;

        buttonInteractionCollector.on('collect', async () => {
            clearTimeout(buttonInteractionTimeout);
            buttonInteractionTimeout = setTimeout(() => {
                buttonRow.components.forEach(component => component.setDisabled(true));
                interaction.editReply({ embeds: [embed], components: [buttonRow] });
            }, 15000);
        });

        async function showPreviousVouch() {
            currentPage--;
            vouchIndex -= maxVouchesPerPage;
            vouch = memberVouches.slice(vouchIndex, vouchIndex + maxVouchesPerPage);

            embed.spliceFields(0, embed.fields.length);
            embed.addField('Membre:', `<@${interaction.guild.members.cache.get(vouch[0].reviewer).id}>`, false)
                .addField('Commentaires:', vouch[0].reviews, true)
            embed.setThumbnail(interaction.guild.members.cache.get(vouch[0].reviewer).user.displayAvatarURL({ dynamic: true, size: 1024 }))
            embed.setFooter(`Page ${currentPage} of ${maxPages}`);

            previousButton.setDisabled(currentPage === 1);
            nextButton.setDisabled(false);
            homeButton.setDisabled(currentPage === 1);

            await interaction.editReply({ embeds: [embed], components: [buttonRow] });
        }

        async function showNextVouch() {
            currentPage++;
            vouchIndex += maxVouchesPerPage;
            vouch = memberVouches.slice(vouchIndex, vouchIndex + maxVouchesPerPage);

            embed.spliceFields(0, embed.fields.length);
            embed.addField('Membere:', `<@${interaction.guild.members.cache.get(vouch[0].reviewer).id}>`, false)
                .addField('Commentaires:', vouch[0].reviews, true)
            embed.setThumbnail(interaction.guild.members.cache.get(vouch[0].reviewer).user.displayAvatarURL({ dynamic: true, size: 1024 }));
            embed.setFooter(`Page ${currentPage} of ${maxPages}`);

            previousButton.setDisabled(false);
            nextButton.setDisabled(currentPage === maxPages);
            homeButton.setDisabled(currentPage === 1);

            await interaction.editReply({ embeds: [embed], components: [buttonRow] });
        }

        async function showFirstVouch() {
            currentPage = 1;
            vouchIndex = 0;
            vouch = memberVouches.slice(vouchIndex, vouchIndex + maxVouchesPerPage);

            embed.spliceFields(0, embed.fields.length);
            embed.addField('Membre:', `<@${interaction.guild.members.cache.get(vouch[0].reviewer).id}>`, false)
                .addField('Commentaires:', vouch[0].reviews, true)
            embed.setThumbnail(interaction.guild.members.cache.get(vouch[0].reviewer).user.displayAvatarURL({ dynamic: true, size: 1024 }))
            embed.setFooter(`Page ${currentPage} of ${maxPages}`);

            previousButton.setDisabled(true);
            nextButton.setDisabled(false);
            homeButton.setDisabled(true);

            await interaction.editReply({ embeds: [embed], components: [buttonRow] });
        }
    },
};
