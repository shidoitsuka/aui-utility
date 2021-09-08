const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState) {
    const bot = oldState.client;
    /*
     * @LOGGING
     */

    // init embed
    const embed = new MessageEmbed();
    // check if user joined a voice channel
    if (oldState.channelId == null) {
      embed
        .setColor("#85de76")
        .setAuthor(
          `${oldState.member.user.tag} has joined #${newState.channel.name}`
        )
        .addFields(
          {
            name: "**Channel**",
            value: `**\`${newState.channel.name}\`** / \`${newState.channel.id}\``,
            inline: false,
          },
          {
            name: "**User**",
            value: `<@${newState.id}> / \`${newState.id}\``,
            inline: true,
          }
        );
    }
    // check if user left a voice channel
    if (newState.channelId == null) {
      embed
        .setColor("#e37d76")
        .setAuthor(
          `${oldState.member.user.tag} has left #${oldState.channel.name}`
        )
        .addFields(
          {
            name: "**Channel**",
            value: `**\`${oldState.channel.name}\`** / \`${oldState.channel.id}\``,
            inline: false,
          },
          {
            name: "**User**",
            value: `<@${newState.id}> / \`${newState.id}\``,
            inline: false,
          }
        );
    }
    // check if user changed voice channel
    if (oldState.channelId != null && newState.channelId != null) {
      if (oldState.channelId == newState.channelId) {
        embed
          .setColor("#76ded2")
          .setAuthor(
            `${oldState.member.user.tag} has reconnected to #${oldState.channel.name}`
          )
          .addFields(
            {
              name: "**Channel**",
              value: `**\`${oldState.channel.name}\`** / \`${oldState.channel.id}\``,
              inline: false,
            },
            {
              name: "**User**",
              value: `<@${newState.id}> / \`${newState.id}\``,
              inline: true,
            }
          );
      } else {
        embed
          .setColor("#d4db74")
          .setAuthor(`${oldState.member.user.tag} has switched voice channel`)
          .addFields(
            {
              name: "**Old Channel**",
              value: `**\`${oldState.channel.name}\`** / \`${oldState.channel.id}\``,
              inline: false,
            },
            {
              name: "**New Channel**",
              value: `**\`${newState.channel.name}\`** / \`${newState.channel.id}\``,
              inline: false,
            },
            {
              name: "**User**",
              value: `<@${newState.id}> / \`${newState.id}\``,
              inline: true,
            }
          );
      }
    }

    embed.setTimestamp();
    bot.guilds.cache
      .get(bot.config.logGuildId)
      .channels.cache.get(bot.db.get("voiceUpdateChannel"))
      .send({ embeds: [embed] })
      .catch((err) => console.error("[VOICE UPDATE]", err));

    if (!Object.keys(bot.db.get("voiceChannels")).includes(oldState.channelId))
      return;
    if (oldState.channel.members.size == 0) {
      // delete the channel
      bot.db.delete("voiceChannels", oldState.channelId);
      oldState.channel
        .delete()
        .catch((err) => console.error("[VOICE STATE DELETE]", err));
    }
  },
};
