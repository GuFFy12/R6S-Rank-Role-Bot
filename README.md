<div align="center">

R6S-Rank-Role-Bot

Paste r6ru rank bot, using part of src NFS rank bot. I stopped wanting to do a project because it needs to take into account a lot of values, each of which needs to be described. This is especially true for autoUpdate.

#
# ROADMAP
</div>

# V0.1.x

+ ✓ Rewrite base mongodb discord bot, change mongodb schema, delete unnecessary staff, some small changes to create server data.
+ ✓ Add ranks function, like get user rank and save it in db, update rank, delete rank.
+ ✓ Add setup function: create rank and platform roles and save it to server data.
+ ✓ Add auto ranks update: every X hours update every rank in db (you can see remain time in bot activity).
+ Add delete function, when bot leave from server, or user leave from server, delete data about it.
+ Add cooldown on setup role.
+ Add =updateRank @user for administrators.
+ Better embeds, help. Make the final code to which in the future I will new functions.
+ Add default channel for commands.

# V0.2.x

+ SOON

# V0.3.x

+ SOON

<div align="center">

# COOL STORY
</div>

In 2019, I became a server moder for a popular guide-maker, streamer awog. Then, as well as in principle, and now the most popular server in the Russian community for R6S was r6russia. Our server, Need For Siege, was on the 2nd place (I did not know any other ru servers). And then one day I went to the server r6ru and saw a wonderful bot that gave out roles by rank in r6s. I got tanned with white envy to paste their bot, but at that moment I had zero knowledge of my knowledge and programming at the most. Then Slonser entered our server. He made a bot that, using the r6api.js wrapper, mysql database and then gave out the rank, saved it, and also automatically updated the ranks every 12 hours. The code was shit.
So why did I make this bot after so much time? For the sake of saying what I can make it now. Well, now, I made a bot. Based on data storage in mongodb and module command system. The code has not been completed yet, I will probably publish it when I come to version 3.0 where I will add verification through the qr code on the avatar in the uplay profile, as well as borrowing a couple of functions from the bot r6ru. The complete roadmap for the versions that I set myself can be viewed above

