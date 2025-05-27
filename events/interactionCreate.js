const { InteractionType } = require('discord.js');
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const cmd = client.commands.get(interaction.commandName);
      if (cmd && cmd.autocomplete) return cmd.autocomplete(interaction);
    } else if (interaction.isButton()) {
      const id = interaction.customId;
      const subs = require('../utils/subscriptions');
      const s = subs.get(interaction.guild.id);
      if (s) {
        if (id==='skip') s.skip();
        if (id==='pause') s.pause();
        if (id==='resume') s.resume();
      }
      return interaction.reply({ content:'Done', ephemeral:true });
    } else if (interaction.isCommand()) {
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) return;
      try { await cmd.execute(interaction); } catch (e) { console.error(e); interaction.reply({ content:'Error', ephemeral:true }); }
    }
  }
};
