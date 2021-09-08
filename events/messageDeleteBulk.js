const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "messageDeleteBulk",
  async execute(message, bot) {
    let channelID;
    message.map(m => {
      channelID = m.channelId;
    });
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setAuthor("Bulk Deleted Message")
      .addFields(
        { name: "**Total Message**", value: `\`${message.size}\` message(s)` },
        { name: "**In channel**", value: `<#${channelID}> / \`${channelID}\`` },
      )
      .setTimestamp();
    bot.guilds.cache.get(bot.config.logGuildId).channels.cache.get(bot.db.get("messageDeleteBulkChannel")).send({ embeds: [embed] }).catch(err => console.error("[MESSAGE DELETE BULK]", err));
  },
};
