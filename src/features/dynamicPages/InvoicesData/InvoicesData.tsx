import { FC, useState, useEffect, useContext } from "react";
import { Alert, Table } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";
import { API_URL, FetchingDataStatus, Endpoints } from "../../../app/constans";
import { getOptions } from "../../../app/utils";
import { RefreshContext } from "../../../context/RefreshContext";
import { UserContext } from "../../../context/UserContext";
import { IInvoicesDataState } from "../../../interfaces";
import { ActionButtons } from "../../links/ActionButtons";
import { Loader } from "../../links/Loader";
import { ReturnToHomePage } from "../../links/ReturnToHomePage";

export const InvoicesData: FC = () => {
  const [data, setData] = useState<IInvoicesDataState["invoicesData"]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<IInvoicesDataState["status"]>(FetchingDataStatus.LOADING);
  const { refreshContext } = useContext(RefreshContext);
  const { userContext } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    setStatus(FetchingDataStatus.LOADING);
    fetch(API_URL + Endpoints.INVOICES_DATA, getOptions(userContext.token))
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
    return location.pathname === Endpoints.INVOICES_DATA ? (
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

  return location.pathname === Endpoints.INVOICES_DATA ? (
    <>
      <div className="container">
        <h1 className="table-heading">Dane do faktur</h1>
        <div className="row text-center flex-wrap">
          {FetchingDataStatus.IDLE && data.length !== 0 ? (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Imię</th>
                  <th>Nazwisko</th>
                  <th>Nazwa firmy</th>
                  <th>NIP</th>
                  <th>Adres</th>
                  <th>Telefon</th>
                  <th>Email</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {data.map((element) => (
                  <tr key={element._id.toString()}>
                    <th>{element.first_name}</th>
                    <th>{element.last_name}</th>
                    <th>{element.company_name}</th>
                    <th>{element.company_vat_number}</th>
                    <th>{element.company_address}</th>
                    <th>{element.company_phone}</th>
                    <th>{element.company_email}</th>
                    <th><ActionButtons id={element._id} endpoint={Endpoints.INVOICES_DATA} /></th>
                  </tr>))}
              </tbody>
            </Table>) : <p>W systemie nie ma jeszcze żadnych danych do faktur!</p>}
        </div>
      </div>
      <div className="container">
        <p>
          <Link className="btn btn-primary btn-lg" to={Endpoints.ADD_INVOICES_DATA}>Dodaj dane do faktury</Link>
          {' '}
          <ReturnToHomePage />
        </p>
      </div>
    </>
  ) : <Outlet />
}
