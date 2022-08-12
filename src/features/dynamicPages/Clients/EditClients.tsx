import { FC, useState, useEffect, useContext } from "react";
import { Alert, Table } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";
import { API_URL, Endpoints, FetchingDataStatus } from "../../../app/constans";
import { getOptions } from "../../../app/utils";
import { RefreshContext } from "../../../context/RefreshContext";
import { UserContext } from "../../../context/UserContext";
import { IClientsState } from "../../../interfaces";
import { ActionButtons } from "../../links/ActionButtons";
import { Loader } from "../../links/Loader";
import { ReturnToHomePage } from "../../links/ReturnToHomePage";

export const EditClients: FC = () => {
  const [data, setData] = useState<IClientsState["clients"]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<IClientsState["status"]>(FetchingDataStatus.IDLE);
  const { refreshContext } = useContext(RefreshContext);
  const { userContext } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    setStatus(FetchingDataStatus.LOADING);
    fetch(API_URL + Endpoints.CLIENTS, getOptions(userContext.token))
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
    return location.pathname === Endpoints.SERVICES ? (
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

  return location.pathname === Endpoints.CLIENTS ? (
    <div className="container">
      <h1 className="table-heading">Klienci</h1>
      <div className="row text-center flex-wrap">
        {FetchingDataStatus.IDLE && data.length !== 0 ? (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Imię i nazwisko</th>
                <th>Email</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user._id.toString()}>
                  <th>{user.firstName} {user.lastName}</th>
                  <th>{user.username}</th>
                  <th><ActionButtons id={user._id} endpoint={Endpoints.USERS} /></th>
                </tr>))}
            </tbody>
          </Table>) : <p>W systemie nie ma jeszcze zarejestrowanych klientów!</p>}
      </div>
    </div>
  ) : <Outlet />
}
