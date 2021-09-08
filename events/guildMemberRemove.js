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
  name: "guildMemberRemove",
  async execute(member) {
    const bot = member.client;
    const time = new Date();
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
      .setColor("#808080")
      .setAuthor(`${member.user.tag} has left`)
      .addFields(
        { name: "**Username**", value: `<@${member.id}>`, inline: true },
        { name: "**User ID**", value: `\`${member.id}\``, inline: true }
      )
      .setFooter(
        `Left at: ${timeString} • Member count: ${member.guild.memberCount}`
      );
    bot.guilds.cache.get(bot.config.logGuildId).channels.cache.get(bot.db.get("messageLeaveChannel")).send({ embeds: [embed] }).catch(err => console.error("[GUILD LEAVE]", err));
  },
};
