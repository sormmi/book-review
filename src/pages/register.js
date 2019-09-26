import React, { useContext, useState } from "react"
import {FirebaseContext} from "../firebase"
import { Form, Input, Button, Message } from "../components/common"
import { navigate } from "../../.cache/gatsby-browser-entry"

const RegisterPage = () => {

  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const { firebase } = useContext(FirebaseContext);

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (formValues.password.length < 6) {
      setErrorMessage('Salasanan pituus vähintään 6 merkkiä');
      return;
    }

    if (formValues.password !== formValues.confirmPassword) {
      setErrorMessage('Salasanat eivät vastaa toisiaan');
      return;
    }

    firebase.register({
      username: formValues.username,
      email: formValues.email,
      password: formValues.password
    }).then(() => {
      navigate("/");
    }).catch(err => {
      console.log(err.message);
      setErrorMessage("Rekisteröinti epäonnistui");
    });
  }

  const handleInputChange = (e) => {
    e.persist();
    setFormValues(currentValues => ({
      ...currentValues,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section>
      <Form onSubmit={onFormSubmit}>
        <Input value={formValues.username} name="username" onChange={handleInputChange} type="text"
               placeholder="käyttäjätunnus" required/>
        <Input value={formValues.email} name="email" onChange={handleInputChange} type="email"
               placeholder="sähköpostiosoite" required/>
        <Input value={formValues.password} name="password" onChange={handleInputChange} type="password"
               placeholder="salasana" required minLength={6}/>
        <Input value={formValues.confirmPassword} name="confirmPassword" onChange={handleInputChange} type="password"
               placeholder="salasana uudelleen" required minLength={6}/>
        <Button type="submit" block>Rekisteröidy</Button>
        {errorMessage &&
          <Message>{errorMessage}</Message>
        }
      </Form>
    </section>
  )
}

export default RegisterPage
