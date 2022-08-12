import { FC, useState, useEffect, useContext } from "react";
import { Alert } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";
import { API_URL, Endpoints, FetchingDataStatus, UserRoles } from "../../../app/constans";
import { getOptions } from "../../../app/utils";
import { RefreshContext } from "../../../context/RefreshContext";
import { UserContext } from "../../../context/UserContext";
import { IServicesState } from "../../../interfaces";
import { Loader } from "../../links/Loader";
import { ReturnToHomePage } from "../../links/ReturnToHomePage";
import { ClientTiles } from "./ClientTiles";
import { EmployeeTable } from "./EmployeeTable";

export const Services: FC = () => {
  const [data, setData] = useState<IServicesState["services"]>([]);
  const [status, setStatus] = useState<IServicesState["status"]>(FetchingDataStatus.LOADING);
  const [error, setError] = useState("");
  const { userContext } = useContext(UserContext);
  const { refreshContext } = useContext(RefreshContext);
  const location = useLocation();

  useEffect(() => {
    setStatus(FetchingDataStatus.LOADING);
    fetch(API_URL + Endpoints.SERVICES, getOptions(userContext.token))
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
            <Link className="btn btn-primary btn-lg" to={Endpoints.ADD_SERVICES}>Zarezerwuj usługę</Link>
            {' '}
            <ReturnToHomePage />
          </p>
        </div>
      </>
    ) : <Outlet />
  }

  return location.pathname === Endpoints.SERVICES ? (<>
    <div className="container mb-3">
      <h1 className="table-heading">Zarezerwowane usługi</h1>
      <div className="row text-center flex-wrap">
        {FetchingDataStatus.IDLE && data.length !== 0 ?
          userContext.details?.role_id === UserRoles.CLIENT ?
            <ClientTiles data={data} /> :
            <EmployeeTable data={data} /> :
          <p>Nie masz jeszcze zarezerwowanych usług!</p>}
      </div>
    </div>
    <div className="container">
      <p>
        <Link className="btn btn-primary btn-lg" to={Endpoints.ADD_SERVICES}>Zarezerwuj usługę</Link>
        {' '}
        <ReturnToHomePage />
      </p>
    </div>
  </>) : <Outlet />
}
