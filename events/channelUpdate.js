module.exports = {
  name: "channelUpdate",
  async execute(oldChannel, newChannel) {
    const bot = oldChannel.client;
    if (!Object.keys(bot.db.get("voiceChannels")).includes(oldChannel.id)) return;
    if (newChannel.name != bot.db.get("voiceChannels", oldChannel.id)) {
      newChannel.setName(bot.db.get("voiceChannels", oldChannel.id)).catch(err => console.log("[PREVENT GAME VCHANNEL CHANGE NAME]", err));
    }
    // oldMsg.channel.send(`<@${oldMsg.author.id}> updated ${oldMsg.content} to ${newChannel.content} in <#${oldMsg.channel.id}> ${oldMsg.url}`);
  },
};
