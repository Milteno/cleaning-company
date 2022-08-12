import { Link } from "react-router-dom";

export function NotSignedIn() {
  return (
    <>
      <li className={"nav-item"}>
        <Link className="nav-link text-white" to="/logowanie">Logowanie</Link>
      </li>
      <li className={"nav-item"}>
        <Link className="nav-link text-white" to="/rejestracja">Rejestracja</Link>
      </li>
    </>
  );
}
