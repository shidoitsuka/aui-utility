const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const config = require("./config.json");
const Enmap = require("enmap");

const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  partials: ["REACTION", "MESSAGE", "CHANNEL", "GUILD_MEMBER"],
});

bot.config = config;

// if dev mode is true, then config will set to dev guild
if (bot.config.devmode) {
  bot.config.token = bot.config.DEVtoken;
  bot.config.clientId = bot.config.DEVclientId;
  bot.config.guildId = bot.config.DEVguildId;
  bot.config.baseVoiceChannelId = bot.config.DEVbaseVoiceChannelId;
  bot.config.emojis = bot.config.DEVemojis;
}

// database
bot.db = new Enmap({ name: "data" });
bot.config.defaultDBKey.map((key) => {
  if (!bot.db.has(key.name)) bot.db.set(key.name, key.value);
});

// Commands
bot.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.data.name, command);
}

// Events
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    bot.once(event.name, (...args) => event.execute(...args));
  } else {
    bot.on(event.name, (...args) => event.execute(...args, bot));
  }
}

bot.login(bot.config.token);
