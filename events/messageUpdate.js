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
  name: "messageUpdate",
  async execute(oldMessage, newMessage) {
    const bot = oldMessage.client;
    let oldMsg;
    if (oldMessage.partial) {
      oldMsg = await oldMessage.fetch();
    } else {
      oldMsg = oldMessage;
    }
    if (oldMsg.author.bot) return;
    // parse message time to readable format
    const time = new Date(oldMsg.createdAt);
    const timeString = `[${
      time.getHours() < 10 ? "0" + time.getHours() : time.getHours()
    }:${time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()}] ${
      day[time.getDay()]
    }, ${time.getDate() < 10 ? "0" + time.getDate() : time.getDate()}-${
      time.getMonth() + 1 < 10
        ? "0" + (time.getMonth() + 1)
        : time.getMonth() + 1
    }-${time.getFullYear()}`;
    // get old message url
    const oldMsgUrl = `https://discordapp.com/channels/${oldMsg.guild.id}/${oldMsg.channel.id}/${oldMsg.id}`;
    const embed = new MessageEmbed()
      .setColor("#FFFF00")
      .setAuthor("Updated Message")
      .addFields(
        {
          name: "**Message Link**",
          value: `[Click Here](${oldMsgUrl}) / \`${oldMsg.id}\``,
        },
        {
          name: "**Sent by**",
          value: `<@${oldMsg.author.id}> / \`${oldMsg.author.id}\``,
        },
        {
          name: "**In channel**",
          value: `<#${oldMsg.channel.id}> / \`${oldMsg.channel.id}\``,
        },
        {
          name: "**Original Message**",
          value:
            oldMsg.content.length > 1020
              ? `${oldMsg.content.substring(0, 1020)}...`
              : oldMsg.content,
        },
        {
          name: "**Edited Message**",
          value:
            newMessage.content.length > 1020
              ? `${newMessage.content.substring(0, 1020)}...`
              : newMessage.content,
        }
      )
      .setFooter(`Message Timestamp: ${timeString}`)
      .setTimestamp();
    const attachment = newMessage.attachments.first();
    if (attachment) embed.setImage(attachment.url);
    bot.guilds.cache
      .get(bot.config.logGuildId)
      .channels.cache.get(bot.db.get("messageUpdateChannel"))
      .send({ embeds: [embed] })
      .catch((err) => console.error("[MESSAGE UPDATE]", err));
    // oldMsg.channel.send(`<@${oldMsg.author.id}> updated ${oldMsg.content} to ${newMessage.content} in <#${oldMsg.channel.id}> ${oldMsg.url}`);
  },
};
