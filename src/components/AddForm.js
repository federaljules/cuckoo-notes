import React, { useState } from "react";
import {
  Form,
  FormLabel,
  Button,
  FormControl,
} from "react-bootstrap";

function AddForm({ toggle }) {
  const [name, setName] = useState("");
  const [getUser, setGetUser] = useState("");


  const addUser = async function () {
    let data = {
      name: name,
    };

    if (name === "") {
      alert("Give username before adding");
    } else {
      console.log(name);
      fetch("http://localhost:5000/api/add", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((json) => {
          setGetUser(json);
          setInterval(function(){window.location.reload(false);
            setName("");}, 2000)
          clear();
        })
        .catch((err) => console.log(new Error(err)));
    }
  };

  const clear = () => document.getElementById("addForm").reset();

  return (
    <Form id="addForm" className={toggle ? "active" : "hide"}>
      <FormLabel
        className={
          getUser !== "" && getUser.error
            ? "active error-label"
            : getUser !== "" && getUser.success
            ? "active success-label"
            : "hide"
        }
      >
        {getUser.error ? getUser.error : "Added succesfully!"}
      </FormLabel>

      <FormControl
        placeholder="Unique username"
        onChange={(e) => {
          setName(e.target.value);
        }}
      ></FormControl>

      <Button className="btn btn-block btn-primary" onClick={addUser}>
        Add user
      </Button>
    </Form>
  );
}

export default AddForm;
