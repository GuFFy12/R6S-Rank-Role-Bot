module.exports = {
  name: "deleterank",
  description: "Delete rank data for user on this server.",
  aliases: ["delete"],
  public: true,
  async execute(bot, message, args, config) {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`This command can only be used by an administrator!`);

    if (!args[0]) {
      return message.reply(`=deleteRank @user`);
    }

    let member = message.mentions.users.first();
    let userData = await User.findOneAndDelete({ guildID: message.guild.id, userID: member.id });
    let guildData = await Guild.findOne({ guildID: message.guild.id });

    if (!userData) return message.reply(`User not found!`);

    try {
      let deleteRankRole = message.guild.roles.cache.find((r) => r.id === guildData.ranks[userData.rank]);
      message.guild.member(member).roles.remove(deleteRankRole);
      let deletePlatformRole = message.guild.roles.cache.find((r) => r.id === guildData.platforms[userData.platform]);
      message.guild.member(member).roles.remove(deletePlatformRole);
    } catch (e) {}
    let embed = new Discord.MessageEmbed().setDescription(`Rank data was delete for **${member}**!`).setColor(config.color);
    message.channel.send(embed);
  },
};
