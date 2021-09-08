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
const moment = require("moment");

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
    // moment, get the difference between now and the user account created
    const nowTime = moment(new Date());
    const a = moment(new Date(userCreated));
    const userCreatedTime = moment.duration(a.diff(nowTime)).humanize();
    const time = new Date(member.joinedAt);
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
      .setColor("#00FF00")
      .setAuthor(`${member.user.tag} has joined`)
      .addFields(
        { name: "**User**", value: `<@${member.id}> / \`${member.id}\``, inline: true },
        {
          name: "**Account created at**",
          value: `${userCreatedDate} *[${userCreatedTime} ago]*`,
          inline: false,
        }
      )
      .setFooter(
        `Joined at: ${timeString} • Member count: ${member.guild.memberCount}`
      );
    bot.guilds.cache
      .get(bot.config.logGuildId)
      .channels.cache.get(bot.db.get("messageJoinChannel"))
      .send({ embeds: [embed] })
      .catch((err) => console.error("[GUILD JOIN]", err));
    // console.log(`${member.user.tag} has joined ${member.guild.name} member is now ${member.guild.memberCount}`);
  },
};
