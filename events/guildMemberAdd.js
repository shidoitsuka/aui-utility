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
  name: "guildMemberAdd",
  async execute(member) {
    const bot = member.client;
    // get user account created
    const userCreated = new Date(member.user.createdAt);
    // convert to readdable date
    const userCreatedDate = `${
      userCreated.getDate() < 10
        ? "0" + userCreated.getDate()
        : userCreated.getDate()
    }-${
      userCreated.getMonth() + 1 < 10
        ? "0" + (userCreated.getMonth() + 1)
        : userCreated.getMonth() + 1
    }-${userCreated.getFullYear()}`;
    const time = new Date(member.joinedAt);
    const timeString = `[${
      time.getHours() < 10 ? "0" + time.getHours() : time.getHours()
    }:${time.getMinutes()}] ${day[time.getDay()]}, ${
      time.getDate() < 10 ? "0" + time.getDate() : time.getDate()
    }-${
      time.getMonth() + 1 < 10
        ? "0" + (time.getMonth() + 1)
        : time.getMonth() + 1
    }-${time.getFullYear()}`;
    const embed = new MessageEmbed()
      .setColor("#00FF00")
      .setAuthor(`${member.user.tag} has joined`)
      .addFields(
        { name: "**Username**", value: `<@${member.id}>`, inline: true },
        { name: "**User ID**", value: `\`${member.id}\``, inline: true },
        { name: "**Account created at**", value: userCreatedDate, inline: false }
      )
      .setFooter(
        `Joined at: ${timeString} • Member count: ${member.guild.memberCount}`
      );
    bot.guilds.cache
      .get(bot.config.logGuildId)
      .channels.cache.get(bot.db.get("messageJoinChannel"))
      .send({ embeds: [embed] })
      .catch((err) => console.error("[MESSAGE UPDATE]", err));
    // console.log(`${member.user.tag} has joined ${member.guild.name} member is now ${member.guild.memberCount}`);
  },
};
