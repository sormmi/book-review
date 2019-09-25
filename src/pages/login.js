import React, { useContext, useState } from "react"
import {FirebaseContext} from "../firebase"
import { Form, Input, Button, ErrorMessage } from "../components/common"
import { navigate } from "../../.cache/gatsby-browser-entry"

const LoginPage = () => {

  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const { firebase } = useContext(FirebaseContext);

  const onFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await firebase.login({ email: formValues.email, password: formValues.password });
      navigate("/");
    } catch (error) {
      console.log("ERROR", "Login failed");
      setErrorMessage("Käyttäjätunnus tai salasana virheellinen");
    }
  }

  const handleInputChange = (e) => {
    e.persist();
    setFormValues(currentValues => ({
      ...currentValues,
      [e.target.name]: e.target.value
    }));
    setErrorMessage('');
  };

  return (
    <section>
      <Form onSubmit={onFormSubmit}>
        <Input value={formValues.email} name="email" onChange={handleInputChange} type="email"
               placeholder="sähköpostiosoite"/>
        <Input value={formValues.password} name="password" onChange={handleInputChange} type="password"
               placeholder="salasana"/>
        <Button type="submit" block>Kirjaudu sisään</Button>
        {errorMessage &&
          <ErrorMessage>{errorMessage}</ErrorMessage>
        }
      </Form>
    </section>
  )
}

export default LoginPage
