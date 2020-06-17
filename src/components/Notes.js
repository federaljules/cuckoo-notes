import React, { useState, useEffect } from "react";
import {
  Form,
  Dropdown,
  Button,
  FormControl,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import AddForm from "./AddForm";

function Notes() {
  const [note, setNote] = useState("");
  const [gottenNotes, setGottenNotes] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [toggleAddForm, setToggleAddForm] = useState(false);

  const [dataAdded, setDataAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers();
    setNote("");
    setDataAdded(false);
    return () => {};
  }, [dataAdded]);

  const getUsers = async () => {
    await fetch("http://localhost:5000/api/getusers")
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setUsernames(json);
        setLoading(false);
      })
      .catch((err) => console.log(new Error(err)));
  };

  const addNote = async function () {
    let data = {
      name: currentUser,
      note: note,
    };
    if (note === "") {
      alert("Write note before adding");
    } else {
      console.log(note);
      await fetch("http://localhost:5000/api/addnote", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          setGottenNotes(json[0].notes.reverse());
          setDataAdded(!dataAdded);
          clear();
        })
        .catch((err) => console.log(new Error(err)));
    }
  };

  const getNotes = async function (name) {
    let data = {
      name: name,
    };
    await fetch("http://localhost:5000/api/getnotes", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((json) => {
        setGottenNotes(json[0].notes.reverse());
        setLoading(false);
      });
  };

  const handleSelect = (evkey, ev) => {
    setCurrentUser(ev);
    getNotes(ev);
  };

  const clear = () => document.getElementById("clear").reset();

  if (loading) {
    return (
      <div className="loader">
        <h2>Loading</h2>
        <img alt="loading.." src={require("../img/Eclipse-0.8s-191px.gif")}></img>
      </div>
    );
  }

  return (
    <div className="notes-container">
      <h1 className="noteName">
        {currentUser === "" ? "Happy note app :)" : currentUser + "'s notes"}
      </h1>
      <div className="notes">
        <Dropdown>
          <Button
            onClick={() => {
              setToggleAddForm(!toggleAddForm);
            }}
            variant={toggleAddForm ? "danger" : "primary"}
            className="adduser"
          >
            Add user
          </Button>

          <Dropdown.Toggle variant="outline-success" id="dropdown-basic">
            Select user
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {usernames.map((item, i) => {
              return (
                <Dropdown.Item
                  value={item.name}
                  onSelect={() => handleSelect(i, item.name)}
                  key={i}
                >
                  {item.name}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>

        <AddForm toggle={toggleAddForm}></AddForm>

        <Form id="clear">
          <InputGroup className="mb-3 full">
            <FormControl
              disabled={currentUser === "" ? true : false}
              onChange={(e) => {
                setNote(e.target.value);
              }}
              placeholder={
                currentUser === ""
                  ? "Select user before adding a note"
                  : "New note"
              }
              aria-describedby="basic-addon2"
            />

            <InputGroup.Append>
              <Button
                disabled={currentUser === "" ? true : false}
                onClick={addNote}
                variant="success"
              >
                Add
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>

        <ListGroup className=".flex-column-reverse">
          {gottenNotes.map((item, i) => {
            return (
              <ListGroup.Item
                id={i}
                onMouseOver={(e) => console.log(e.target.id)}
                key={i}
              >
                {item.note}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>
    </div>
  );
}

export default Notes;
