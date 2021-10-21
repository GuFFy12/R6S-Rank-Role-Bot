module.exports = {
  name: "getrank",
  description: "Add your r6s account.",
  aliases: ["get"],
  public: true,
  async execute(bot, message, args, config) {
    if (!args[0]) {
      return message.reply(
        `=getRank R6S_username Platform[uplay, xbl, psn](Default uplay) Region[emea, ncsa, apac](Default emea) (=getRank GuFFy_OwO uplay emea)`
      );
    }

    let member = message.guild.member(message.author);
    let userData = await User.findOne({ guildID: message.guild.id, userID: member.user.id });
    let guildData = await Guild.findOne({ guildID: message.guild.id });
    let username = args[0];
    let platform = args[1];
    let region = args[2];

    if (guildData.setup == "false") return message.reply(`Guild not configured. Ask the administrator to write =setup to add rank roles!`);

    if (!platform) platform = "uplay";
    if (!region) region = "emea";

    let gameId = await getId(username, platform);
    if (!gameId) return message.reply(`Your account was not found. Check the correctness of the entered data!`);
    let rank = await getRank(gameId, platform, region);
    if (!rank) return message.reply(`Your rank data was not found, you play siege? Check the correctness of the entered data!`);

    try {
      let deleteRankRole = message.guild.roles.cache.find((r) => r.id === guildData.ranks[userData.rank]);
      let deletePlatformRole = message.guild.roles.cache.find((r) => r.id === guildData.platforms[platform]);
      member.roles.remove(deleteRankRole);
      member.roles.remove(deletePlatformRole);
    } catch (e) {}

    if (!userData) {
      User.create({
        guildID: message.guild.id,
        userID: message.author.id,
        gameID: gameId,
        platform: platform,
        region: region,
        rank: rank.current.name,
      });
    } else {
      userData.gameID = gameId;
      userData.platform = platform;
      userData.region = region;
      userData.rank = rank.current.name;
      userData.save();
    }

    try {
      let rankRole = message.guild.roles.cache.find((r) => r.id === guildData.ranks[rank.current.name]);
      let platformRole = message.guild.roles.cache.find((r) => r.id === guildData.platforms[platform]);
      member.roles.add(rankRole);
      member.roles.add(platformRole);
    } catch (e) {
      return message.reply(
        `Some of the roles that I wanted to give are remove on this server. Ask the administrator to write =setup to re-add roles!`
      );
    }

    let embed = new Discord.MessageEmbed()
      .setDescription(`You have successfully linked your account **${username}**!`)
      .setColor(config.color);
    message.channel.send(embed);

    async function getId(username, platform) {
      try {
        let id = await r6api.findByUsername(platform, username).then((el) => el[0].userId);
        return id;
      } catch (e) {
        return;
      }
    }

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
