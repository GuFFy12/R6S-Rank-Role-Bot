module.exports = {
  name: "forceupdate",
  description: "Force rank data update.",
  aliases: ["force"],
  public: false,
  async execute(bot, message, args, config) {
    let userData = await User.find();

    for (let i = userData.length - 1; i > -1; i--) {
      let rank = await getRank(userData[i].gameID, userData[i].platform, userData[i].region);
      if (userData[i].rank != rank.current.name) {
        userData[i].rank = rank.current.name;
        userData[i].save();
      }
    }

    let embed = new Discord.MessageEmbed().setDescription(`Rank data was updated!`).setColor(config.color);
    message.channel.send(embed);

    async function getRank(id, platform, region) {
      try {
        let rank = await r6api
          .getRanks(platform, id, { regionIds: region, boardIds: "pvp_ranked" })
          .then((el) => el[0].seasons[Object.keys(el[0].seasons)].regions[region].boards.pvp_ranked);
        return rank;
      } catch (e) {
        return;
      }
    }
  },
};
