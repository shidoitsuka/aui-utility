const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember) {
    // check if the user changed name
    if (oldMember.user.bot) return;
    const bot = oldMember.client;
    const embed = new MessageEmbed();
    if (oldMember.roles.cache.size != newMember.roles.cache.size) {
      let tmpOldRoles = [];
      let tmpNewRoles = [];
      oldMember.roles.cache.map((r) => {
        if (r.name == "@everyone") return;
        tmpOldRoles.push(`**${r.name}**`);
      });
      newMember.roles.cache.map((r) => {
        if (r.name == "@everyone") return;
        tmpNewRoles.push(`**${r.name}**`);
      });
      embed
        .setColor("#FFFF00")
        .setAuthor(`${oldMember.user.tag} role has been updated`)
        .addFields(
          {
            name: "**User ID**",
            value: `\`${oldMember.user.id}\` / <@${oldMember.user.id}>`,
            inline: false,
          },
          tmpOldRoles.length > 0
            ? {
                name: "**Old Roles**",
                value: `${tmpOldRoles.join(", ")}`,
                inline: true,
              }
            : { name: "**Old Roles**", value: "None", inline: true },
          {
            name: "**New Roles**",
            value: `${tmpNewRoles.join(", ")}`,
            inline: true,
          }
        )
        .setTimestamp();
      bot.guilds.cache
        .get(bot.config.logGuildId)
        .channels.cache.get(bot.db.get("roleUpdateChannel"))
        .send({ embeds: [embed] })
        .catch((err) => console.error("[ROLE UPDATE]", err));
    }
    if (oldMember.nickname != newMember.nickname) {
      console.log("NICKNAME UPDATE");
      embed
        .setColor("#FFFF00")
        .setAuthor(`${oldMember.user.tag} updated their nickname`)
        .addFields(
          {
            name: "**User ID**",
            value: `\`${oldMember.user.id}\` / <@${oldMember.user.id}>`,
            inline: false,
          },
          {
            name: "**Old**",
            value: `${
              oldMember.nickname == null
                ? oldMember.user.username
                : oldMember.nickname
            }`,
            inline: true,
          },
          {
            name: "**New**",
            value: `${
              newMember.nickname == null
                ? newMember.user.username
                : newMember.nickname
            }`,
            inline: true,
          }
        )
        .setTimestamp();
      bot.guilds.cache
        .get(bot.config.logGuildId)
        .channels.cache.get(bot.db.get("nicknameUpdateChannel"))
        .send({ embeds: [embed] })
        .catch((err) => console.error("[NICKNAME UPDATE]", err));
    }
    // oldMsg.channel.send(`<@${oldMsg.author.id}> updated ${oldMsg.content} to ${newMember.content} in <#${oldMsg.channel.id}> ${oldMsg.url}`);
  },
};
