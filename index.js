require('dotenv').config();
const { Client, GatewayIntentBits, InteractionType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const subscriptions = require('./utils/subscriptions');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
});
client.commands = new (require('discord.js').Collection)();

// Load commands
const commandsPath = path.join(__dirname, 'commands/music');
fs.readdirSync(commandsPath).filter(f => f.endsWith('.js')).forEach(file => {
  const cmd = require(path.join(commandsPath, file));
  client.commands.set(cmd.data.name, cmd);
});

// Load events
const eventsPath = path.join(__dirname, 'events');
fs.readdirSync(eventsPath).forEach(file => {
  const evt = require(path.join(eventsPath, file));
  client.on(evt.name, (...args) => evt.execute(...args, client));
});

// Voice cleanup
client.on('voiceStateUpdate', (oldState, newState) => {
  if (oldState.channelId && !newState.channelId && oldState.channel.members.size === 1) {
    const gid = oldState.guild.id;
    if (subscriptions.has(gid)) {
      subscriptions.get(gid).stop();
      subscriptions.delete(gid);
      logger.info(`Cleaned subscription for ${gid}`);
    }
  }
});

// Start bot
client.login(process.env.TOKEN);

// Dashboard
const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/queue/:guildId', (req, res) => {
  const sub = subscriptions.get(req.params.guildId);
  if (!sub) return res.status(404).json({ error: 'No subscription' });
  res.json({ queue: sub.queue });
});
app.post('/api/skip/:guildId', (req, res) => {
  const sub = subscriptions.get(req.params.guildId);
  if (!sub) return res.status(400).json({ error: 'Cannot skip' });
  sub.skip();
  res.json({ success: true });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Dashboard on http://localhost:${PORT}`));