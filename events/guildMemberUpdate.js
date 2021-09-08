const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember) {
    // check if the user changed name
    if (oldMember.user.bot) return;
    const bot = oldMember.client;
    const roleEmbed = new MessageEmbed();
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
      roleEmbed
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
                name: "**Old Role**",
                value: `${tmpOldRoles.join("\n• ")}`,
                inline: true,
              }
            : { name: "**Old Role**", value: "None", inline: true },
          {
            name: "**New Role**",
            value: `${tmpNewRoles.join("\n• ")}`,
            inline: true,
          }
        )
        .setTimestamp();
      bot.guilds.cache
        .get(bot.config.logGuildId)
        .channels.cache.get(bot.db.get("roleUpdateChannel"))
        .send({ embeds: [roleEmbed] })
        .catch((err) => console.error("[ROLE UPDATE]", err));
    }
    const nickEmbed = new MessageEmbed();
    if (oldMember.nickname != newMember.nickname) {
      console.log("NICKNAME UPDATE");
      nickEmbed
        .setColor("#FFFF00")
        .setAuthor(`${oldMember.user.tag} updated their nickname`)
        .addFields(
          {
            name: "**User ID**",
            value: `\`${oldMember.user.id}\` / <@${oldMember.user.id}>`,
            inline: false,
          },
          {
            name: "**Before**",
            value: `${
              oldMember.nickname == null
                ? oldMember.user.username
                : oldMember.nickname
            }`,
            inline: true,
          },
          {
            name: "**After**",
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
        .send({ embeds: [nickEmbed] })
        .catch((err) => console.error("[NICKNAME UPDATE]", err));
    }
    // oldMsg.channel.send(`<@${oldMsg.author.id}> updated ${oldMsg.content} to ${newMember.content} in <#${oldMsg.channel.id}> ${oldMsg.url}`);
  },
};
