const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
const db = require("./modules/databaseActions");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
db.connect();

app.post("/api/add", (req, res) => {
  let name = req.body.name;

  db.addUser(name, function (result) {
    res.json(result);
  });
});

app.post("/api/getnotes", (req, res) => {
  let name = req.body.name;

  console.log(name);

  db.getNotes(name, function (result) {
    res.send(result);
  });
});

app.get("/api/getusers", (req, res) => {
  db.getUsers(function (result) {
    res.send(result);
  });
});

app.post("/api/addnote", (req, res) => {
  let note = req.body.note;
  let name = req.body.name;

  db.addNote(name, note, function (result) {
    console.log("Added " + result);
    res.send(result);
  });
});

app.listen(port, () =>
  console.log(`Notes database listening on port ${port}!`)
);
