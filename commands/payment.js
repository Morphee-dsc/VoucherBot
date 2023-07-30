const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('payment')
        .setDescription('💲 Montre les options de paiements'),
    async execute(interaction) {
        const paymentEmbed = new MessageEmbed()
            .setTitle('Payment Options')
            .addField('PayPal', 'https://paypal.me/a-modifier')
            .addField('LTC', 'M8zvJPt3CqhZhUBr6zVYtYA9BatqLLTVbM')
            .setColor('#68d19e')
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({ embeds: [paymentEmbed] });
    },
};
