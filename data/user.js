const schema = mongoose.Schema({
  guildID: String,
  userID: String,
  gameID: String,
  platform: String,
  region: String,
  rank: String,
});
module.exports = mongoose.model("User", schema);
