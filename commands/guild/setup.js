module.exports = {
  name: "setup",
  description: "Сreate ranks, platform roles.",
  aliases: [""],
  public: true,
  async execute(bot, message, args, config) {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`This command can only be used by an administrator!`);

    let guildData = await Guild.findOne({ guildID: message.guild.id });
    let rankKeys = Object.keys(guildData.ranks);
    let platformKeys = Object.keys(guildData.platforms);

    try {
      for (let i = rankKeys.length - 1; i > -1; i--) {
        message.guild.roles.cache.find((role) => role.name === rankKeys[i]).delete();
      }
    } catch (e) {}

    try {
      for (let i = platformKeys.length - 1; i > -1; i--) {
        message.guild.roles.cache.find((role) => role.name === platformKeys[i]).delete();
      }
    } catch (e) {}

    for (let i = rankKeys.length - 1; i > -1; i--) {
      let role = rankKeys[i].split(" ")[0];
      message.guild.roles
        .create({
          data: { name: rankKeys[i], color: config.colors[role] },
        })
        .then((role) => {
          guildData.ranks[rankKeys[i]] = role.id;
          guildData.save();
        });
    }

    for (let i = platformKeys.length - 1; i > -1; i--) {
      let role = platformKeys[i].split(" ")[0];
      message.guild.roles
        .create({
          data: { name: platformKeys[i], color: config.colors[role] },
        })
        .then((role) => {
          guildData.platforms[platformKeys[i]] = role.id;
          guildData.save();
        });
    }

    guildData.setup = "true";
    guildData.save();

    let embed = new Discord.MessageEmbed().setDescription(`You have successfully setup this server!`).setColor(config.color);
    message.channel.send(embed);
  },
};
