const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const url =
  "mongodb+srv://cuckoo_admin:cuckoo123@cluster0-vkpn3.gcp.mongodb.net/cuckoo?retryWrites=true&w=majority";

let schema = new Schema(
  {
    name: String,
    notes: [],
  },
  { collection: "users" }
);

const User = mongoose.model("User", schema);

exports.connect = function () {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  let db = mongoose.connection;

  db.on("error", function (err) {
    console.log(err);
    mongoose.connection.close();
  });
  db.once("open", function () {
    console.log("Connected to db");
  });
};

exports.addUser = function (userName, result) {
  let newUser = new User({
    name: userName,
    notes: [],
  });

  User.find({ name: userName }, function (err, users) {
    if (err) result(new Error(err.message));

    if (users === undefined || users.length == 0) {
      newUser.save(function (err, res) {
        if (err) result(new Error(err.message));

        result({ success: res });
      });
    } else {
      result({ error: "Username has been taken!" });
    }
  });
};

exports.addNote = function (name, noteTxt, result) {
  User.findOneAndUpdate(
    { name: name },
    { $push: { notes: { note: noteTxt, date: new Date() } } },
    function (err, res) {
      if (err) result(new Error(err.message));

      User.find({ name: name }, (err, notes) => {
        if (err) result(new Error(err.message));

        result(notes);
      });
    }
  );
};

exports.getNotes = function (name, response) {
  User.find({ name: name }, function (err, res) {
    if (err) response(new Error(err.message));

    response(res);
  });
};

exports.getUsers = function (response) {
  User.find({}, function (err, res) {
    if (err) response(new Error(err.message));
    response(res);
  });
};
