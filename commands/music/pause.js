const { SlashCommandBuilder } = require('discord.js');
const subs = require('../../utils/subscriptions');
module.exports = {
  data: new SlashCommandBuilder().setName('pause').setDescription('Pause'),
  async execute(i) { const s=subs.get(i.guild.id); s? (s.pause(), i.reply('Paused.')) : i.reply('No music.'); }
};
