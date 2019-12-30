import React, { useState, useContext } from "react";
import { Form, Input, Button, Message } from "../components/common";
import { FirebaseContext } from "../firebase";

const AddAuthor = () => {
  const { firebase } = useContext(FirebaseContext);
  const [authorName, setAuthorName] = useState("");
  const [success, setSuccess] = useState(false);

  const onAuthorChange = e => {
    e.persist();
    setAuthorName(e.target.value);
  };

  const onFormSubmit = e => {
    e.preventDefault();
    setSuccess(false);

    firebase
      .createAuthor({
        authorName,
      })
      .then(() => {
        setAuthorName("");
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      })
      .catch(err => console.log(err));
  };

  return (
    <Form onSubmit={onFormSubmit}>
      <Input
        placeholder="kirjailijan nimi"
        value={authorName}
        onChange={onAuthorChange}
      />
      <Button type="submit" block>
        Tallenna kirjailija
      </Button>
      {success && <Message success>Kirjailijan tallennus onnistui</Message>}
    </Form>
  );
};

export default AddAuthor;
