
const mongoose = require("mongoose");

const streamsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildIDs: {
    default: undefined,
    type: Array,
  },
  note: {
    default: "555",
    type: String,
  },
});

module.exports = mongoose.model("Streams", streamsSchema);
