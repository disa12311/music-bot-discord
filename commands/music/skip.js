const { SlashCommandBuilder } = require('discord.js');
const subs = require('../../utils/subscriptions');
module.exports = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Skip song'),
  async execute(i) {
    const s = subs.get(i.guild.id);
    if (!s) return i.reply('No music.');
    s.skip();
    i.reply('Skipped.');
  }
};