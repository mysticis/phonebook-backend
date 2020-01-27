const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Give password parameter");
  process.exit(1);
}
const password = process.argv[2];

const url = `mongodb+srv://joe-martin:${password}@cluster0-2okkp.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log("Connection Succeeded"))
  .catch(err => console.log("Connection failed", err));

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model("Person", personSchema);

//For creating new entries
if (process.argv.length > 3) {
  const record = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });

  record.save().then(response => {
    console.log(
      `Added ${response.name}, Number: ${response.number} to phonebook`
    );
    mongoose.connection.close();
  });
}

//to get all records
if (process.argv.length === 3) {
  Person.find({}).then(response => {
    console.log("PhoneBooK:");
    response.forEach(record => console.log(`${record.name}: ${record.number}`));
    mongoose.connection.close();
  });
}
