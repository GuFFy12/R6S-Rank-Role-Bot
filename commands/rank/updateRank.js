module.exports = {
  name: "updaterank",
  description: "Update your rank data.",
  aliases: ["update"],
  public: true,
  async execute(bot, message, args, config) {
    let member = message.guild.member(message.author);
    let userData = await User.findOne({ guildID: message.guild.id, userID: member.user.id });
    let guildData = await Guild.findOne({ guildID: message.guild.id });

    if (guildData.setup == "false") return message.reply(`Guild not configured. Ask the administrator to write =setup to add rank roles!`);

    if (!userData) return message.reply(`You not linked your siege account. Use =getRank!`);
    let rank = await getRank(userData.gameID, userData.platform, userData.region);
    if (!rank) return message.reply(`Your rank data was not found, you play siege? Check the correctness of the entered data!`);

    try {
      let deleteRankRole = message.guild.roles.cache.find((r) => r.id === guildData.ranks[userData.rank]);
      member.roles.remove(deleteRankRole);
    } catch (e) {}

    userData.rank = rank.current.name;
    userData.save();

    try {
      let rankRole = message.guild.roles.cache.find((r) => r.id === guildData.ranks[rank.current.name]);
      member.roles.add(rankRole);
    } catch (e) {
      return message.reply(
        `Some of the roles that I wanted to give are remove on this server. Ask the administrator to write =setup to re-add roles!`
      );
    }

    let embed = new Discord.MessageEmbed().setDescription(`You have successfully update your rank data!`).setColor(config.color);
    message.channel.send(embed);

    async function getRank(id, platform, region) {
      try {
        let rank = await r6api
          .getRanks(platform, id, { regionIds: region, boardIds: "pvp_ranked" })
          .then((el) => el[0].seasons[config.season].regions[region].boards.pvp_ranked);
        return rank;
      } catch (e) {
        return;
      }
    }
  },
};
