const sleep = require("util").promisify(setTimeout);
module.exports = {
  name: "messageReactionAdd",
  async execute(interaction, user) {
    let reaction;
    if (interaction.message.partial) {
      reaction = await interaction.fetch();
    } else {
      reaction = interaction;
    }
    if (
      reaction.message.id != "884064323092242482" &&
      !reaction.client.config.devmode
    )
      return;
    const reactorId = user.id;
    const reactor = await reaction.message.guild.members.fetch(reactorId, {
      force: true,
    });
    const bot = reaction.client;
    if (!Object.keys(bot.config.emojis).includes(reaction.emoji.id)) {
      await reaction.users.remove(reactorId);
      return;
    }
    if (reactor.voice.channel?.id != bot.config.baseVoiceChannelId) {
      reaction.message.channel
        .send(
          `<@${reactorId}> Please join <#${bot.config.baseVoiceChannelId}> voice channel first!`
        )
        .then(async (m) => {
          await reaction.users.remove(reactorId);
          await sleep(5000);
          m.delete();
        });
    } else {
      const voiceChannelId = reactor.voice.channel.id;
      if (voiceChannelId != bot.config.baseVoiceChannelId) return;
      const name = `🎮┇${bot.config.emojis[reaction.emoji.id].name} - ${
        reactor.user.tag
      }`;
      const baseVoiceChannelPos = bot.channels.cache.get(
        bot.config.baseVoiceChannelId
      ).position;
      bot.channels.cache
        .get(bot.config.baseVoiceChannelId)
        .clone({ name, userLimit: bot.config.emojis[reaction.emoji.id].max })
        .then((createdVoiceChannel) => {
          createdVoiceChannel.setPosition(baseVoiceChannelPos + 1);
          bot.db.set("voiceChannels", name, createdVoiceChannel.id);
          reactor.voice
            .setChannel(createdVoiceChannel)
            .then((_) => {
              reaction.users
                .remove(reactorId)
                .catch((err) => console.error("[REMOVING REACTION]", err));
            })
            .catch((err) =>
              console.error("[MOVING USER TO NEW VOICE CHANNEL]", err)
            );
        })
        .catch((err) => console.error("[CLONING VOICE CHANNEL]", err));
    }
  },
};
