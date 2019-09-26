import React, { useState, useContext, useEffect } from "react"
import { Form, Input, Button, Message } from "../components/common"
import { FirebaseContext } from "../firebase"
import styled from "styled-components"

const FormField = styled.div`
  margin-bottom: 16px;
`

let fileReader;

if (typeof window !== 'undefined') {
  fileReader = new FileReader()
}

const AddBook = () => {
  const { firebase } = useContext(FirebaseContext)
  const [authors, setAuthors] = useState([])
  const [bookName, setBookName] = useState("")
  const [summary, setSummary] = useState("")
  const [bookCover, setBookCover] = useState("")
  const [authorId, setAuthorId] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fileReader.addEventListener("load", () => {
      setBookCover(fileReader.result)
    })
  }, [])

  useEffect(() => {
    if (firebase) {
      firebase
        .getAllAuthors()
        .then(authors => {
          const availableAuthors = []

          authors.forEach(doc => {
            availableAuthors.push({
              id: doc.id,
              ...doc.data(),
            })
          })

          setAuthorId(availableAuthors[0].id)
          setAuthors(availableAuthors)
        })
        .catch(err => console.log(err))
    }
  }, [firebase])

  const onBookChange = e => {
    e.persist()
    setBookName(e.target.value);
  }

  const onSummaryChange = e => {
    e.persist()
    setSummary(e.target.value);
  }

  const onAuthorChange = e => {
    e.persist()
    setAuthorId(e.target.value)
  }

  const onFileChange = e => {
    e.persist()
    fileReader.readAsDataURL(e.target.files[0])
  }

  const onFormSubmit = e => {
    e.preventDefault()
    setSuccess(false)

    firebase
      .createBook({
        bookName,
        bookCover,
        authorId,
        summary
      })
      .then(() => {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
        }, 5000)
      })
      .catch(err => console.log(err))
  }

  return (
    <Form onSubmit={onFormSubmit}>
      <FormField>
        <strong>Kirjan nimi</strong>
        <Input
          value={bookName}
          onChange={onBookChange}
        />
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
        <strong>Kirjan kansi</strong>
        <Input type="file" onChange={onFileChange} />
      </FormField>
      <FormField>
        <strong>Kuvaus</strong>
        <Input type="text" value={summary} onChange={onSummaryChange} />
      </FormField>
      <Button type="submit" block>
        Tallenna kirja
      </Button>
      {success && <Message success>Kirjan tallennus onnistui</Message>}
    </Form>
  )
}

export default AddBook
