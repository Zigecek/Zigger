const bodyParser = require("body-parser");
const express = require("express");
const Config = require("../models/Config");
const Discord = require("discord.js");
const { bot } = require("../bot");

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
  const finalArg0 =
    event == "PrintStarted"
      ? "Started: "
      : event == "PrintFailed"
      ? "Failed: "
      : "Done: ";
  const finalArg2 = event == "PrintFailed" ? " \nReason: " + args[2] : "";
  Config.findOne(
    {
      number: 1,
    },
    async (err, Gres) => {
      if (err) {
        console.error(err);
        return;
      }
      const user = await bot.users.fetch(Gres.botAdminDiscordID[0]);

      user.send(
        new Discord.MessageEmbed()
          .setTitle(args[0])
          .setDescription(finalArg0 + args[1] + finalArg2)
          .setTimestamp()
      );
      res.sendStatus(200);
    }
  );
});

app.listen(port);
