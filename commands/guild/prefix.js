module.exports = {
  name: "prefix",
  description: "Change bot prefix.",
  aliases: ["set-prefix"],
  public: true,
  async execute(bot, message, args, config) {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`This command can only be used by an administrator!`);

    let data = await Guild.findOne({ guildID: message.guild.id });

    if (!args[0]) return message.reply(`Specify the desired prefix`);
    if (args[0].length > 5) return message.reply(`I can't put a prefix in a long more than 5 characters`);

    data.prefix = args[0];
    data.save();

    let embed = new Discord.MessageEmbed()
      .setColor(config.color)
      .setDescription(`You have successfully changed the bot prefix to \`${args[0]}\`!`);
    message.channel.send(embed);
  },
};
