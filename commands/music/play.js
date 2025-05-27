const { SlashCommandBuilder } = require('discord.js');
const playdl = require('play-dl');
const { joinVoiceChannel } = require('@discordjs/voice');
const MusicSubscription = require('../../utils/MusicSubscription');
const subs = require('../../utils/subscriptions');
const cache = require('../../utils/searchCache');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music')
    .addStringOption(o=>o.setName('input').setDescription('Name or URL').setRequired(true).setAutocomplete(true)),
  async autocomplete(interaction) {
    const v = interaction.options.getFocused();
    let results = cache.get(v) || await playdl.search(v, { limit: 5 });
    cache.set(v, results);
    await interaction.respond(results.map(x=>({ name: x.title, value: x.url })));
  },
  async execute(interaction) {
    const query = interaction.options.getString('input');
    const voice = interaction.member.voice.channel;
    if (!voice) return interaction.reply('Join a voice channel.');
    await interaction.deferReply();
    let sub = subs.get(interaction.guild.id);
    if (!sub) {
      const conn = joinVoiceChannel({ channelId: voice.id, guildId: voice.guild.id, adapterCreator: voice.guild.voiceAdapterCreator });
      sub = new MusicSubscription(conn, interaction.channel);
      subs.set(interaction.guild.id, sub);
    }
    const info = playdl.yt_validate(query)==='video'
      ? await playdl.video_info(query)
      : (await playdl.search(query, { limit:1 }))[0];
    const stream = await playdl.stream(info.url);
    sub.enqueue({ title: info.title, stream: stream.stream, type: stream.type, thumbnail: info.thumbnail.url });
    await interaction.editReply(`Added: **${info.title}**`);
  }
};