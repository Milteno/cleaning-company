import { useRef, FormEvent, useContext, useState } from "react";
import { FormGroup, Form, Alert } from "react-bootstrap";
import { Link, Navigate, useLocation } from "react-router-dom";
import { API_URL, Endpoints, GENERIC_ERROR_MESSAGE, INVALID_CREDENTIALS_MESSAGE, INVALID_DATA_MESSAGE } from "../../app/constans";
import { postWithoutCredentialsOptions } from "../../app/utils";
import { UserContext } from "../../context/UserContext";
import { SaveButton } from "../links/SaveButton";

export function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { userContext, setUserContext } = useContext(UserContext);

  const location = useLocation();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const body = JSON.stringify({ username: email, password });

    fetch(API_URL + "/users/logowanie", {
      ...postWithoutCredentialsOptions,
      body: body,
    })
      .then(async response => {
        setIsSubmitting(false)
        if (!response.ok) {
          if (response.status === 400) {
            setError(INVALID_DATA_MESSAGE);
          } else if (response.status === 401) {
            setError(INVALID_CREDENTIALS_MESSAGE);
          } else {
            setError(GENERIC_ERROR_MESSAGE);
          }
        } else {
          const data = await response.json();
          console.warn("data: ", data);
          console.warn("setUserContext token=data.token because of ok response from /users/logowanie");
          setUserContext({ ...userContext, token: data.token });
        }
      })
      .catch(error => {
        setIsSubmitting(false);
        setError(GENERIC_ERROR_MESSAGE);
        console.error(error);
      })
  }

  return (!userContext.token ? (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <h1 id="table-heading">Logowanie</h1>
      <form className="text-start custom-form" onSubmit={handleSubmit}>
        <FormGroup
          className="text-start mb-3"
          controlId="formBasicEmail">
          <Form.Label className="fw-bold">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Wpisz swój adres email"
            ref={emailRef} />
        </FormGroup>
        <Form.Group
          className="text-start mb-3"
          controlId="formBasicPassword">
          <Form.Label className="fw-bold">Hasło</Form.Label>
          <Form.Control
            type="password"
            placeholder="Wpisz swoje hasło"
            ref={passwordRef} />
        </Form.Group>
        <SaveButton isSubmitting={isSubmitting} endpoint={Endpoints.ACCOUNT} />
      </form>
      <p>Nie masz jeszcze konta?</p>
      <Link to="/rejestracja">Zarejestruj się</Link>
    </>
  ) : (
    <Navigate to="/me" replace state={{ from: location }} />
  )
  );
}
