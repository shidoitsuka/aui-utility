const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember) {
    // check if the user changed name
    if (oldMember.user.bot) return;
    const bot = oldMember.client;
    const roleEmbed = new MessageEmbed();
    if (oldMember.roles.cache.size != newMember.roles.cache.size) {
      Object.keys(bot.config.customRolesId).map((cr) => {
        if (!oldMember.roles.cache.has(cr) && newMember.roles.cache.has(cr)) {
          bot.guilds.cache
        .get(bot.config.logGuildId)
        .channels.cache[bot.config.customRolesLogChannel][bot.config.customRolesId[cr]]
        .send("{ embeds: [roleEmbed] }")
        .catch((err) => console.error("[ROLE UPDATE]", err));
        }
      });
      let tmpOldRoles = [];
      let tmpNewRoles = [];
      let updatedRoles = [];
      let state = "";
      let j = 0;
      oldMember.roles.cache.map((r) => {
        if (r.name == "@everyone") return;
        j++;
        tmpOldRoles.push(`**${j} - ${r.name}**`);
      });
      let i = 0;
      newMember.roles.cache.map((r) => {
        if (r.name == "@everyone") return;
        i++;
        tmpNewRoles.push(`**${i} - ${r.name}**`);
      });
      // if new roles has more roles than old roles, then the user has added roles
      if (tmpNewRoles.length > tmpOldRoles.length) {
        console.log("ADDED ROLES");
        updatedRoles = tmpNewRoles.filter((x) => !tmpOldRoles.includes(x));
        state = "added";
      }
      // if old roles has more roles than new roles, then the user has removed roles
      else if (tmpOldRoles.length > tmpNewRoles.length) {
        console.log("REMOVED ROLES");
        updatedRoles = tmpOldRoles.filter((x) => !tmpNewRoles.includes(x));
        state = "removed";
      }
      console.log(updatedRoles);
      roleEmbed
        .setColor(`${state == "added" ? "00FF00" : "#FF0000"}`)
        .setAuthor(`${state == "added" ? "Added new role for" : "Removed a role from"} ${oldMember.user.tag}`)
        .addFields(
          updatedRoles.length > 0
            ? {
                name: `**${state == "added" ? "Added" : "Removed"} Role**`,
                value: updatedRoles.join("\n"),
                inline: false,
              }
            : { name: "**Updated Role**", value: "None", inline: false },
          {
            name: "**User**",
            value: `<@${oldMember.user.id}> / \`${oldMember.user.id}\``,
            inline: false,
          },
          tmpOldRoles.length > 0
            ? {
                name: "**Old Role**",
                value: `${tmpOldRoles.join("\n")}`,
                inline: true,
              }
            : { name: "**Old Role**", value: "None", inline: true },
          {
            name: "**New Role**",
            value: `${tmpNewRoles.join("\n")}`,
            inline: true,
          }
        )
        .setTimestamp();
      bot.guilds.cache
        .get(bot.config.logGuildId)
        .channels.cache.get(bot.db.get("roleUpdateChannel"))
        .send({ embeds: [roleEmbed] })
        .catch((err) => console.error("[ROLE UPDATE]", err));
        updatedRoles = [];
    }

    const nickEmbed = new MessageEmbed();
    if (oldMember.nickname != newMember.nickname) {
      console.log("NICKNAME UPDATE");
      nickEmbed
        .setColor("#FFFF00")
        .setAuthor(`${oldMember.user.tag} updated their nickname`)
        .addFields(
          {
            name: "**User**",
            value: `<@${oldMember.user.id}> / \`${oldMember.user.id}\``,
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
