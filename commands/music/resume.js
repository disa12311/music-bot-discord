const { SlashCommandBuilder } = require('discord.js');
const subs = require('../../utils/subscriptions');
module.exports = {
  data: new SlashCommandBuilder().setName('resume').setDescription('Resume'),
  async execute(i) { const s=subs.get(i.guild.id); s? (s.resume(), i.reply('Resumed.')) : i.reply('No music.'); }
};