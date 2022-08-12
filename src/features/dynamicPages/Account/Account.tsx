import { useCallback, useContext, useEffect } from "react"
import { Card, Button } from "react-bootstrap"
import { API_URL } from "../../../app/constans"
import { getOptions } from "../../../app/utils"
import { UserContext } from "../../../context/UserContext"
import { Loader } from "../../links/Loader"

export const Account = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const fetchUserDetails = useCallback(() => {
    fetch(API_URL + "/users/me", getOptions(userContext.token))
      .then(async response => {
        if (response.ok) {
          const data = await response.json();
          setUserContext({ ...userContext, details: data });
          console.log("data: ", data);
        } else {
          if (response.status === 401) {
            // Edge case: when the token has expired.
            // This could happen if the refreshToken calls have failed due to network error or
            // User has had the tab open from previous day and tries to click on the Fetch button
            // TODO enable reload
            // window.location.reload();
          } else {
            setUserContext({ ...userContext, details: null });
          }
        }
      })
  }, [setUserContext, userContext.token])

  useEffect(() => {
    // fetch only when user details are not present
    if (!userContext.details) {
      fetchUserDetails()
    }
  }, [userContext.details, fetchUserDetails])

  const refetchHandler = () => {
    // set details to undefined so that spinner will be displayed and
    //  fetchUserDetails will be invoked from useEffect
    setUserContext({ ...userContext, details: undefined })
  }

  const logoutHandler = () => {
    fetch(API_URL + "/users/wyloguj", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async response => {
      console.warn("setUserContext token=null because of ok response from /users/wyloguj");
      setUserContext({ ...userContext, details: undefined, token: null })
      window.localStorage.setItem("logout", Date.now().toString())
    })
  }

  return userContext.details === null ? (
    <div>Błąd podczas ładowania szczegółów konta</div>
  ) : !userContext.details ? (
    <Loader />
  ) : (
    <>
      <div className="container mt-3">
        <Card>
          <Card.Img variant="top" />
          <Card.Body>
            <Card.Title>Konto użytkownika</Card.Title>
            <Card.Text>
              Witaj&nbsp;
              <strong>
                {userContext.details.firstName}
                {userContext.details.lastName &&
                  " " + userContext.details.lastName}
              </strong>!
              <br />
              Rola: <strong>{userContext.details.role_id}</strong>
            </Card.Text>
            <Button variant="primary" onClick={logoutHandler}>Wyloguj</Button>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}