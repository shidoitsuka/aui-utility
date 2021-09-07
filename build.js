const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const config = require("./config.json");

let token = config.token;
let clientId = config.clientId;
let guildId = config.guildId;

if (config.devmode) {
  token = config.DEVtoken;
  clientId = config.DEVclientId;
  guildId = config.DEVguildId;
  console.log("CURRENTLY IN DEVELOPMENT MODE!");
}

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
})();
