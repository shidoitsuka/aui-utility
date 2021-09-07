const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Dev only!"),
  async execute(interaction) {
    interaction.client.emit("guildMemberAdd", interaction.member);
    interaction.reply("Emitted!");
  },
};
