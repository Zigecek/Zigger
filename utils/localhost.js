const bodyParser = require("body-parser");
const express = require("express");
const Config = require("../models/Config");
const Discord = require("discord.js");

const port = 3321;
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res, next) {
  res.sendStatus(200);
});

app.post("/toAdmin", function (req, res, next) {
  var args = req.body.args;
  const event = req.body.event;
  Config.findOne(
    {
      number: 1,
    },
    (err, Gres) => {
      if (err) {
        console.error(err);
        return;
      }
      const user = bot.users.cache.find(
        (user) => user.id == Gres.botAdminDiscordID[0]
      );

      user.send(
        new Discord.MessageEmbed()
          .setTitle(args[0])
          .setDescription(
            (event == "PrintStarted"
              ? "Started: "
              : event == "PrintFailed"
              ? "Failed: "
              : "Done: ") +
              args[1] +
              (event == "PrintFailed" ? " \nReason: " + args[2] : "")
          )
          .setTimestamp()
      );
    }
  );
  res.sendStatus(200);
});

app.listen(port);
