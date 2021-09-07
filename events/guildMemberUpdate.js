const { MessageEmbed } = require("discord.js");
const day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMessage, newMessage) {
    // check if the user changed name
    if (oldMessage.user.bot) return;
    if (oldMessage.nickname != newMessage.nickname) {
      const bot = oldMessage.client;
      // get old message url
      const embed = new MessageEmbed()
        .setColor("#FFFF00")
        .setAuthor(`${oldMessage.user.tag} updated their nickname`)
        .addFields(
          { name: "**Old**", value: `${oldMessage.nickname == null ? oldMessage.user.username : oldMessage.nickname}`, inline: true },
          { name: "**New**", value: `${newMessage.nickname == null ? newMessage.user.username : newMessage.nickname}`, inline: true },
          { name: "**User ID**", value: `\`${oldMessage.user.id}\``, inline: true },
          { name: "**Tag**", value: `<@${oldMessage.user.id}>`, inline: true },
        )
        .setTimestamp();
      bot.guilds.cache
        .get(bot.config.logGuildId)
        .channels.cache.get(bot.db.get("nicknameUpdateChannel"))
        .send({ embeds: [embed] })
        .catch((err) => console.error("[NICKNAME UPDATE]", err));
    }
    // oldMsg.channel.send(`<@${oldMsg.author.id}> updated ${oldMsg.content} to ${newMessage.content} in <#${oldMsg.channel.id}> ${oldMsg.url}`);
  },
};
