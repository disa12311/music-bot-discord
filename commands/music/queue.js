const { SlashCommandBuilder } = require('discord.js');
const subs = require('../../utils/subscriptions');
module.exports = {
  data: new SlashCommandBuilder().setName('queue').setDescription('Show queue'),
  async execute(i) {
    const s = subs.get(i.guild.id);
    if (!s || !s.queue.length) return i.reply('Queue empty.');
    i.reply({ content: s.queue.map((x,j)=>`${j+1}. ${x.title}`).join('\n'), ephemeral: true });
  }
};