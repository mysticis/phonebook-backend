require("dotenv").config();
const express = require("express");
const Person = require("./models/persons");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("build"));

//const generateID = () => Math.floor(Math.random() * Math.floor(200));

//get all persons
app.get("/api/persons", (request, response) => {
  Person.find({}).then(returnedRecords => {
    response.json(returnedRecords.map(records => records.toJSON()));
  });
});

//get info on the backend
app.get("/info", (request, response) => {
  const time = new Date();
  Person.find({}).then(result => {
    const showResult = result.map(item => item.toJSON());
    response.send(`Showing records for ${showResult.length} people. 
    Request was made at ${time}`);
  });
});

//get a particular person
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(returnedPerson => {
      if (returnedPerson) {
        response.json(returnedPerson.toJSON());
      } else {
        response.status(404).end();
      }
    })
    .catch(err => next(err));
});
//delete a person
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      console.log("Deleted", deletedPerson.toJSON());
      response.status(204).end();
    })
    .catch(err => next(err));
});
//update a resource
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const personToUpdate = {
    name: body.name,
    number: body.number
  };
  Person.findByIdAndUpdate(request.params.id, personToUpdate, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON());
    })
    .catch(err => next(err));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  if (body.name === undefined || body.number === undefined) {
    response.status(400).json({ error: "Missing Content" });
  }
  const person = new Person({
    name: body.name,
    number: body.number
  });
  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON());
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);
//error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    //return response.status(400).json({ error: error.message });
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

/*let persons = [
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
*/
