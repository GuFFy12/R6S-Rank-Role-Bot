module.exports = {
  name: "help",
  description: "Find out the bot's commands.",
  aliases: ["h"],
  public: true,
  async execute(bot, message, args, config) {
    let guildData = await Guild.findOne({ guildID: message.guild.id });
    function list(cat, cname) {
      return `**${cname}**: ${bot.commands
        .filter((cmd) => cmd.category == cat)
        .map((cmd) => `\`${guildData.prefix + cmd.name}\``)
        .join(", ")}`;
    }

    let embed = new Discord.MessageEmbed()
      .setColor(config.color)
      .setDescription(`${list("rank", "Rank")}\n${list("guild", "Guild")}`)
      .setFooter(`Total commands: ${bot.commands.size} | https://github.com/GuFFy12`);
    message.channel.send(embed);
  },
};
