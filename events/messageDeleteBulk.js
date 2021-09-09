const { MessageEmbed } = require("discord.js");
const pastegg = require("paste.gg");

module.exports = {
  name: "messageDeleteBulk",
  async execute(message, bot) {
    let channelID;
    // get channel id
    message.map((m) => {
      channelID = m.channelId;
    });
    // init embed
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setAuthor("Bulk Deleted Message")
      .setTimestamp();

    // init paste.gg
    const pasteGG = new pastegg(bot.config.pasteGG);

    // init datetime
    const now = new Date();
    const date = `${now.getDate() < 10 ? "0" + now.getDate() : now.getDate()}/${
      now.getMonth() < 10 ? "0" + now.getMonth() : now.getMonth()
    }/${now.getFullYear()} [${
      now.getHours() < 10 ? "0" + now.getHours() : now.getHours()
    }:${now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()}]`;

    // post to paste.gg
    pasteGG
      .post({
        files: [
          {
            name: `Bulk delete #${channelID} - ${date}.log`,
            content: {
              format: "text",
              value: `${date}\nDeleted ${
                message.size
              } message(s)\nMessage ID | Channel | Author | Content\n${message
                .map((m) => {
                  if (m.partial) return `Failed to fetch from cache!`;
                  return `${m.id} | #${m.channel.name} (${m.channel.id}) | ${m.author.username}#${m.author.discriminator} | ${m.content}`;
                })
                .join("\n")}`,
            },
          },
        ],
      })
      .then(async (res) => {
        // post to discord
        embed.addFields(
          {
            name: "**Total Message**",
            value: `\`${message.size}\` message(s)`,
          },
          {
            name: "**In channel**",
            value: `<#${channelID}> / \`${channelID}\``,
          },
          {
            name: "**URL**",
            value: `[Click Here](${res.result.url})`,
          }
        );
        // send to channel
        bot.guilds.cache
          .get(bot.config.logGuildId)
          .channels.cache.get(bot.db.get("messageDeleteBulkChannel"))
          .send({ embeds: [embed] })
          .catch((err) => console.error("[MESSAGE DELETE BULK]", err));
      })
      .catch((err) => console.error("[PASTEBIN ERROR]", err));
  },
};
