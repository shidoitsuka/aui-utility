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
  name: "messageDelete",
  async execute(message) {
    if (message.partial) return;
    if (message.author.bot) return;
    const bot = message.client;
    // parse message time to readable format
    const time = new Date(message.createdAt);
    const timeString = `[${
      time.getHours() < 10 ? "0" + time.getHours() : time.getHours()
    }:${time.getMinutes() ? "0" + time.getMinutes() : time.getMinutes()}] ${
      day[time.getDay()]
    }, ${time.getDate() < 10 ? "0" + time.getDate() : time.getDate()}-${
      time.getMonth() + 1 < 10
        ? "0" + (time.getMonth() + 1)
        : time.getMonth() + 1
    }-${time.getFullYear()}`;
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setAuthor("Deleted Message")
      .addFields(
        { name: "**Sent by**", value: `<@${message.author.id}>` },
        { name: "**In channel**", value: `<#${message.channel.id}>` },
        {
          name: "**User ID**",
          value: `\`${message.author.id}\``,
          inline: true,
        },
        { name: "**Message ID**", value: `\`${message.id}\``, inline: true },
        {
          name: "**Channel ID**",
          value: `\`${message.channel.id}\``,
          inline: true,
        }
      )
      .setFooter(`Message Timestamp: ${timeString}`)
      .setTimestamp();
    const attachment = message.attachments.first();
    if (attachment) embed.setImage(attachment.url);
    if (message.content.length > 0)
      embed.setDescription(
        message.content.length > 1024
          ? message.content.substring(0, 1021) + "..."
          : message.content
      );
    bot.guilds.cache
      .get(bot.config.logGuildId)
      .channels.cache.get(bot.db.get("messageDeleteChannel"))
      .send({ embeds: [embed] })
      .catch((err) => console.error("[MESSAGE DELETE]", err));
  },
};
