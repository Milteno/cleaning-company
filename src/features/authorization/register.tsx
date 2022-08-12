import { useRef, FormEvent, useContext, useState } from "react";
import { Form, FormGroup, Alert } from "react-bootstrap";
import { Link, Navigate, useLocation } from "react-router-dom";
import { API_URL, Endpoints, GENERIC_ERROR_MESSAGE, INVALID_CREDENTIALS_MESSAGE, INVALID_DATA_MESSAGE } from "../../app/constans";
import { postWithoutCredentialsOptions } from "../../app/utils";
import { UserContext } from "../../context/UserContext";
import { SaveButton } from "../links/SaveButton";

export function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { userContext, setUserContext } = useContext(UserContext);
  const location = useLocation();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmedPasswordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmedPassword = confirmedPasswordRef.current?.value;

    if (
      firstName !== undefined &&
      lastName !== undefined &&
      email !== undefined &&
      password !== undefined &&
      confirmedPassword !== undefined
    ) {
      if (
        firstName?.length < 35 &&
        lastName?.length < 35 &&
        email?.length < 35 &&
        password?.length < 35 &&
        confirmedPassword?.length < 35
      ) {
        if (!!password && password === confirmedPassword) {
          const body = JSON.stringify({ firstName, lastName, username: email, password });
          fetch(API_URL + "/users/rejestracja", {
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
                } else if (response.status === 500) {
                  console.log(response);
                  const data = await response.json();
                  if (data.message) setError(data.message || GENERIC_ERROR_MESSAGE)
                } else {
                  setError(GENERIC_ERROR_MESSAGE);
                }
              } else {
                const data = await response.json();
                console.log("data: ", data);
                console.warn("setUserContext token=data.token because of ok response from /users/rejestracja");
                setUserContext({ ...userContext, token: data.token });
              }
            })
            .catch(error => {
              console.error(error);
              setIsSubmitting(false);
              setError(GENERIC_ERROR_MESSAGE);
            })
        } else {
          setError("Podane hasła nie pasują do siebie!");
          setIsSubmitting(false);
        }
      } else {
        setError("Wpisana długość nie powinna przekraczać 35 znaków!");
        setIsSubmitting(false);
      }
    } else {
      setError("Uzupełnij wszystkie pola!");
      setIsSubmitting(false);
    }
  }

  if (userContext.token) {
    return <Navigate to="/me" replace state={{ from: location }} />;
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <h1 id="table-heading">Rejestracja</h1>
      <form className="text-start custom-form" onSubmit={handleSubmit}>
        <FormGroup
          className="text-start mb-3"
          controlId="formBasicFirstName">
          <Form.Label className="fw-bold">Imię</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wpisz swoje imię"
            ref={firstNameRef} />
        </FormGroup>
        <FormGroup
          className="text-start mb-3"
          controlId="formBasicLastName">
          <Form.Label className="fw-bold">Nazwisko</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wpisz swoje nazwisko"
            ref={lastNameRef} />
        </FormGroup>
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
        <Form.Group
          className="text-start mb-3"
          controlId="formBasicPassword">
          <Form.Label className="fw-bold">Powtórz hasło</Form.Label>
          <Form.Control
            type="password"
            placeholder="Wpisz ponownie swoje hasło"
            ref={confirmedPasswordRef} />
        </Form.Group>
        <SaveButton isSubmitting={isSubmitting} endpoint={Endpoints.ACCOUNT} />
      </form>
      <p>Masz już konto?</p>
      <Link to="/logowanie">Zaloguj się</Link>
    </>
  )
}
