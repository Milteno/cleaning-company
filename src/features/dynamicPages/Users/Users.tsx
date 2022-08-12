import { FC, useState, useEffect, useContext } from "react";
import { Alert, Table } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";
import { API_URL, Endpoints, FetchingDataStatus } from "../../../app/constans";
import { getOptions } from "../../../app/utils";
import { RefreshContext } from "../../../context/RefreshContext";
import { UserContext } from "../../../context/UserContext";
import { IUsersState } from "../../../interfaces";
import { ActionButtons } from "../../links/ActionButtons";
import { Loader } from "../../links/Loader";
import { ReturnToHomePage } from "../../links/ReturnToHomePage";

export const Users: FC = () => {
  const [data, setData] = useState<IUsersState["users"]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<IUsersState["status"]>(FetchingDataStatus.LOADING);
  const { refreshContext } = useContext(RefreshContext);
  const { userContext } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    setStatus(FetchingDataStatus.LOADING);
    fetch(API_URL + Endpoints.ALL_USERS, getOptions(userContext.token))
      .then(res => res.json())
      .then((result) => {
        console.log("result: ", result);
        if (result.status === "Permission error") {
          setStatus(FetchingDataStatus.FAILED);
          setError("Nie masz uprawnień do wyświetlenia zawartości tej strony!");
        }
        if (Array.isArray(result)) {
          setStatus(FetchingDataStatus.IDLE);
          setData(result);
        }
      })
      .catch(error => {
        console.log("Błąd: ", error);
        setStatus(FetchingDataStatus.FAILED);
        setError("Wystąpił nieobsługiwany błąd!");
      });
  }, [refreshContext.refreshId]);

  if (status === FetchingDataStatus.LOADING && data.length === 0) {
    return <Loader />
  }

  if (status === FetchingDataStatus.FAILED) {
    return location.pathname === Endpoints.ALL_USERS ? (
      <>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="container">
          <p>
            <ReturnToHomePage />
          </p>
        </div>
      </>
    ) : <Outlet />
  }

  return location.pathname === Endpoints.ALL_USERS ? (
    <div className="container">
      <h1 className="table-heading">Zarejestrowani użytkownicy</h1>
      <div className="row text-center flex-wrap">
        {FetchingDataStatus.IDLE && data.length !== 0 ? (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Imię i nazwisko</th>
                <th>Email</th>
                <th>Rola</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user._id.toString()}>
                  <th>{user.firstName} {user.lastName}</th>
                  <th>{user.username}</th>
                  <th>{user.role_id}</th>
                  <th><ActionButtons id={user._id} endpoint={Endpoints.ALL_USERS} /></th>
                </tr>))}
            </tbody>
          </Table>) : <p>W systemie nie ma jeszcze zarejestrowanych użytkowników!</p>}
      </div>
    </div>
  ) : <Outlet />
}
