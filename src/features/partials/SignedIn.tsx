import { useContext } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../app/constans";
import { UserContext } from "../../context/UserContext";

export function SignedIn() {
  const { userContext, setUserContext } = useContext(UserContext);

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

  return (
    <>
      <li className={"nav-item"}>
        <Link className="nav-link text-white" to={"/me"}>Zalogowano jako {userContext.details?.username}</Link>
      </li>
      <li className={"nav-item"}>
        <Link className="nav-link text-white" to="" onClick={logoutHandler}>Wyloguj</Link>
      </li>
    </>
  );
}
