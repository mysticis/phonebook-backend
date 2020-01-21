const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("build"));
app.use(morgan("tiny"));
let persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  },
  {
    name: "Arto Hellas",
    number: "234-098",
    id: 7
  },
  {
    name: "Hack",
    number: "3340-987",
    id: 8
  }
];

const generateID = () => Math.floor(Math.random() * Math.floor(200));

//get all persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

//get info on the backend
app.get("/info", (request, response) => {
  const info = persons.length;
  const time = new Date();
  response.send(`PhoneBook has records for ${info} people
  Request was made at ${time}`);
});
//get a particular person
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  const person = persons.find(pers => pers.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
//delete a person
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(pers => pers.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const checkName = persons.find(person =>
    person.name.toLowerCase().includes(body.name.toLowerCase())
  );
  if (!body.name || !body.number) {
    return response
      .status(400)
      .json({ error: "Name and/or number must be given" });
  } else if (checkName) {
    return response.status(400).json({ error: "Name already exists!" });
  }
  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateID()
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});
console.log(morgan());
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
