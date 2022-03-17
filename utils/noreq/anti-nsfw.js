
const { bot } = require("../../bot");
const error = require("../error");
const sharp = require("sharp");
const axios = require("axios");
const nsfw = require("nsfwjs");

var model;
const tf = require("@tensorflow/tfjs-node");

bot.on("ready", async () => {
  model = await nsfw.load();
});

module.exports = {
  async execute(message) {
    if (
      message.attachments.first().name.endsWith(".apng") ||
      message.attachments.first().name.endsWith(".avif") ||
      message.attachments.first().name.endsWith(".gif") ||
      message.attachments.first().name.endsWith(".jpg") ||
      message.attachments.first().name.endsWith(".jpeg") ||
      message.attachments.first().name.endsWith(".jfif") ||
      message.attachments.first().name.endsWith(".pjpeg") ||
      message.attachments.first().name.endsWith(".pjp") ||
      message.attachments.first().name.endsWith(".png") ||
      message.attachments.first().name.endsWith(".svg") ||
      message.attachments.first().name.endsWith(".webp") ||
      message.attachments.first().name.endsWith(".bmp") ||
      message.attachments.first().name.endsWith(".ico") ||
      message.attachments.first().name.endsWith(".cur") ||
      message.attachments.first().name.endsWith(".tif") ||
      message.attachments.first().name.endsWith(".tiff")
    ) {
      const url = message.attachments.first().url;
      const image = await axios({
        method: "GET",
        url: url,
        responseType: "arraybuffer",
      });

      sharp(image.data)
        .toFormat("png")
        .toBuffer(async (err, data, info) => {
          if (err) {
            console.error(err);
            error.sendError(err);
          }
          const imag = await tf.node.decodeImage(data, 3);
          const predictions = await model.classify(imag);

          var int = 0;
          predictions.forEach((e) => {
            if (e.className == "Hentai" || e.className == "Porn") {
              var p = Math.floor(e.probability * 100);
              if (p >= 75) {
                int++;
              }
            }
          });

          if (int > 0) {
            if (message.deletable) {
              message.delete();
            }
            message.channel.send(LMessages.nsfwBlocked);
            return;
          }
        });
    }
  },
};
