const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('customer')
        .setDescription('⭐ Attribue le rôle Client')
        .addUserOption(option => option.setName('user').setDescription('Utilisateur auquel attribuer le rôle').setRequired(true)),
    async execute(interaction) {
        const roleId = '1134185522588291112'; // Met l'id du rôle "Client"'

        if (interaction.user.id !== '1109559949513732309') { // Met ton ID
            return await interaction.reply({ content: 'Tu n\'es pas autorisé a utiliser cette commande.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const customerRole = interaction.guild.roles.cache.get(roleId);

        if (!customerRole) {
            return await interaction.reply({ content: 'Le rôle Client n\' pas était trouvé.', ephemeral: true });
        }

        try {
            await interaction.guild.members.cache.get(user.id).roles.add(customerRole);
            await interaction.reply(`Le role <@&1134185522588291112> a était donner a ${user.tag}.`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur s\'est produite lors de l\'attribution du rôle.', ephemeral: true });
        }
    },
};
