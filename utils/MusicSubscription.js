const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const logger = require('./logger');

class MusicSubscription {
  constructor(connection, textChannel) {
    this.connection = connection;
    this.textChannel = textChannel;
    this.queue = [];
    this.player = createAudioPlayer()
      .on(AudioPlayerStatus.Idle, () => this.processQueue())
      .on('error', e => { logger.error(e); this.processQueue(); });
    this.connection.subscribe(this.player);
    this.isPlaying = false;
  }
  enqueue(song) {
    this.queue.push(song);
    if (!this.isPlaying) this.processQueue();
  }
  async processQueue() {
    const next = this.queue.shift();
    if (!next) {
      this.isPlaying = false;
      setTimeout(() => !this.isPlaying && this.connection.destroy(), 300000);
      return;
    }
    this.isPlaying = true;
    const resource = createAudioResource(next.stream, { inputType: next.type });
    this.player.play(resource);
    this.textChannel.send({ embeds: [{ title: 'Now Playing', description: next.title, thumbnail: { url: next.thumbnail } }] });
  }
  pause() { this.player.pause(); }
  resume() { this.player.unpause(); }
  skip() { this.player.stop(); }
  stop() { this.queue = []; this.player.stop(); }
}
module.exports = MusicSubscription;