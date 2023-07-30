const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mass-role')
        .setDescription('👥 Ajouter ou supprimer un rôle de tous les utilisateurs')
        .addStringOption(option => option.setName('action').setDescription('Action à effectuer (add/remove)').setRequired(true)
            .addChoice('Add', 'add')
            .addChoice('Remove', 'remove')
        )
        .addRoleOption(option => option.setName('role').setDescription('Rôle à ajouter/supprimer à tous les utilisateurs').setRequired(true)),
    async execute(interaction) {
        const action = interaction.options.getString('action');
        const role = interaction.options.getRole('role');

        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return await interaction.reply({ content: 'Vous n\'êtes pas autorisé à utiliser cette commande.', ephemeral: true });
        }

        if (!role.editable) {
            return await interaction.reply({ content: 'Je ne peux pas gérer ce rôle.', ephemeral: true });
        }

        await interaction.deferReply();

        const guildMembers = await interaction.guild.members.fetch();
        const totalMembers = guildMembers.size;
        let modifiedMembers = 0;

        if (action === 'add') {
            guildMembers.forEach(member => {
                if (!member.roles.cache.has(role.id)) {
                    member.roles.add(role).catch(console.error);
                    modifiedMembers++;
                }
            });
        } else if (action === 'remove') {
            guildMembers.forEach(member => {
                if (member.roles.cache.has(role.id)) {
                    member.roles.remove(role).catch(console.error);
                    modifiedMembers++;
                }
            });
        }

        await interaction.editReply(`Role ${role} ${action === 'add' ? 'added' : 'removed'} de ${modifiedMembers} sur ${totalMembers} membres.`);
    },
};
