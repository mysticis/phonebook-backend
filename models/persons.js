require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const uniqueValidator = require("mongoose-unique-validator");
const url = process.env.MONGODB_URI;

console.log("connecting to...", url);
mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log("Connected to database"))
  .catch(err => console.log("Error connecting to database:", err.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
    uniqueCaseInsensitive: true
  },
  number: {
    type: String,
    required: true,
    unique: true,
    minlength: 8
  }
});
personSchema.plugin(uniqueValidator);
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
module.exports = mongoose.model("Person", personSchema);
