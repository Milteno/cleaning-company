import { FC, useState, useEffect, useContext } from "react";
import { Alert, Table } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";
import { API_URL, Endpoints, FetchingDataStatus } from "../../../app/constans";
import { getOptions } from "../../../app/utils";
import { RefreshContext } from "../../../context/RefreshContext";
import { UserContext } from "../../../context/UserContext";
import { ITeamsState } from "../../../interfaces";
import { ActionButtons } from "../../links/ActionButtons";
import { Loader } from "../../links/Loader";
import { ReturnToHomePage } from "../../links/ReturnToHomePage";

export const Teams: FC = () => {
  const [data, setData] = useState<ITeamsState["teams"]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<ITeamsState["status"]>(FetchingDataStatus.LOADING);
  const { userContext } = useContext(UserContext);
  const { refreshContext } = useContext(RefreshContext);
  const location = useLocation();

  useEffect(() => {
    setStatus(FetchingDataStatus.LOADING);
    fetch(API_URL + Endpoints.TEAMS, getOptions(userContext.token))
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
    return location.pathname === Endpoints.TEAMS ? (
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

  return location.pathname === Endpoints.TEAMS ? (
    <>
      <div className="container">
        <h1 className="table-heading">Zespoły pracowników</h1>
        <div className="row text-center flex-wrap">
          {FetchingDataStatus.IDLE && data.length !== 0 ? (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Nazwa</th>
                  <th>Pracownicy</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {data.map((element) => (
                  <tr key={element._id.toString()}>
                    <th>{element.name}</th>
                    <th>{element.employee_id.map((employee, index) => (<p key={index}>{`${employee.firstName} ${employee.lastName}`}</p>))}</th>
                    <th><ActionButtons id={element._id} endpoint={Endpoints.TEAMS} /></th>
                  </tr>))}
              </tbody>
            </Table>) : <p>W systemie nie ma jeszcze zespołów!</p>}
        </div>
      </div>
      <div className="container">
        <p>
          <Link className="btn btn-primary btn-lg" to={Endpoints.ADD_TEAMS}>Utwórz zespół</Link>
          {' '}
          <ReturnToHomePage />
        </p>
      </div>
    </>
  ) : <Outlet />
}
