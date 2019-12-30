import React, { useState, useContext, useEffect, useRef } from "react";
import { Form, Input, Button, Message } from "../components/common";
import { FirebaseContext } from "../firebase";
import styled from "styled-components";

const FormField = styled.div`
  margin-bottom: 16px;
`;

let fileReader;

if (typeof window !== "undefined") {
  fileReader = new FileReader();
}

const AddBook = () => {
  const { firebase } = useContext(FirebaseContext);
  const [authors, setAuthors] = useState([]);
  const [bookName, setBookName] = useState("");
  const [summary, setSummary] = useState("");
  const [bookCover, setBookCover] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [success, setSuccess] = useState(false);
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react"),
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    fileReader.addEventListener("load", () => {
      setBookCover(fileReader.result);
    });
  }, []);

  useEffect(() => {
    if (firebase) {
      firebase
        .getAllAuthors()
        .then(authors => {
          const availableAuthors = [];

          authors.forEach(doc => {
            availableAuthors.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          setAuthorId(availableAuthors[0].id);
          setAuthors(availableAuthors);
        })
        .catch(err => console.log(err));
    }
  }, [firebase]);

  const onBookChange = e => {
    e.persist();
    setBookName(e.target.value);
    setSuccess(false);
  };

  const onSummaryChange = e => {
    e.persist();
    setSummary(e.target.value);
  };

  const onAuthorChange = e => {
    e.persist();
    setAuthorId(e.target.value);
  };

  const onFileChange = e => {
    e.persist();
    fileReader.readAsDataURL(e.target.files[0]);
  };

  const onFormSubmit = e => {
    e.preventDefault();
    setSuccess(false);

    firebase
      .createBook({
        bookName,
        bookCover,
        authorId,
        summary,
      })
      .then(() => {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 10000);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Form onSubmit={onFormSubmit}>
      <FormField>
        <strong>Kirjan nimi</strong>
        <Input value={bookName} onChange={onBookChange} />
      </FormField>
      <FormField>
        <strong>Kirjailija</strong>
        <div>
          <select value={authorId} onChange={onAuthorChange}>
            {authors.map(a => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </FormField>
      <FormField>
        <strong>Kirjan kansikuva</strong>
        <Input type="file" onChange={onFileChange} />
      </FormField>
      <FormField>
        <strong>Kuvaus</strong>
        {editorLoaded && (
          <CKEditor
            editor={ClassicEditor}
            data={summary}
            onChange={(event, editor) => {
              const data = editor.getData();
              setSummary(data);
            }}
          />
        )}
      </FormField>
      <Button type="submit" block>
        Tallenna kirja
      </Button>
      {success && <Message success>Kirjan tallennus onnistui</Message>}
    </Form>
  );
};

export default AddBook;
