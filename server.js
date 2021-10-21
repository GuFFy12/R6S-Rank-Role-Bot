const config = require("./config.json");
global.R6API = require("r6api.js").default;
global.Discord = require("discord.js");
global.mongoose = require("mongoose");
const fs = require("fs");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
global.Guild = require("./data/guild.js");
global.User = require("./data/user.js");
global.r6api = new R6API({ email: config.ubiEmail, password: config.ubiPass });

mongoose.connect(config.dataURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("[✅ DataBase] Connected!");
});

fs.readdirSync("./commands").forEach((module) => {
  const commandFiles = fs.readdirSync(`./commands/${module}/`).filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${module}/${file}`);
    command.category = module;
    bot.commands.set(command.name, command);
  }
});

bot.on("ready", () => {
  console.log(`[✅ Bot] ${bot.user.tag} Online!`);
  bot.generateInvite({ scopes: "bot", permissions: "ADMINISTRATOR" }).then((link) => {
    console.log(link);
  });
  activity();
  setInterval(activity, 900000);
  function activity() {
    bot.user.setActivity("=help Next rank update: " + getTimeLeft(timeout) + "h", { type: "PLAYING" });
  }
});

bot.on("guildCreate", async (guild) => {
  let guildData = await Guild.findOne({ guildID: guild.id });
  if (!guildData) {
    Guild.create({ guildID: guild.id });
  }
  greeting(guild);
});

bot.on("message", async (message) => {
  let guildData = await Guild.findOne({ guildID: message.guild.id });
  if (!guildData) {
    Guild.create({ guildID: message.guild.id });
    greeting(message.guild);
    return;
  }
  if (message.author.bot) return;
  if (message.channel.type == "dm") return;
  if (!message.content.startsWith(guildData.prefix)) return;
  const args = message.content.slice(guildData.prefix.length).trim().split(/ +/g);
  const cmdName = args.shift().toLowerCase();
  const command = bot.commands.get(cmdName) || bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(cmdName));
  if (!command) return;
  if (!require("./config.json").owner.includes(message.author.id) && command.public === false) return;
  command.execute(bot, message, args, config);
});

function greeting(guild) {
  let channel = guild.channels.cache.find((channel) => channel.type === "text" && channel.permissionsFor(guild.me).has("SEND_MESSAGES"));
  channel.send({
    embed: {
      title: "Hi. Im R6S Ranks Bot!",
      color: config.color,
      description: "Default prefix for all my commands is '=', e.g: '=help'.",
      fields: [
        {
          name: "=setup",
          value: "Сreate ranks, kd, wr, region, platform roles",
        },
        {
          name: "=help",
          value: "Get all bot commands",
        },
      ],
    },
  });
}

updateData();
let timeout = setInterval(updateData, config.updateTime * 1000 * 3600);
async function updateData() {
  let userData = await User.find();
  for (let i = userData.length - 1; i > -1; i--) {
    let rank = await getRank(userData[i].gameID, userData[i].platform, userData[i].region);
    if (!userData[i].rank == rank.current.name) {
      userData[i].rank = rank.current.name;
      userData[i].save();
    }
  }
  console.log("Rank data was updated!");
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
}

function getTimeLeft(timeout) {
  return Math.ceil(((timeout._idleStart + timeout._idleTimeout) / 1000 - process.uptime()) / 3600);
}

bot.login(config.token);
