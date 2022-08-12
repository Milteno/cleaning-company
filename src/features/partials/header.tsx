import { faDharmachakra } from '@fortawesome/free-solid-svg-icons';
import { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Endpoints } from '../../app/constans';
import { UserContext } from '../../context/UserContext';
import { NotSignedIn } from './NotSignedIn';
import { SignedIn } from './SignedIn';
import { useLocation } from "react-router-dom";

interface HeaderProps {
  page?: String
}

export const Header: FC<HeaderProps> = (props) => {
  const { page } = props;
  const { userContext } = useContext(UserContext);
  let ExternalJS;
  const location = useLocation();
  return (
    <>
      <nav className={`navbar navbar-expand-lg ${location.pathname === "/" ? "fixed-top" : ''} navbar-dark bg-dark`}>
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img alt="Cleaning Master logo " src="/images/logo.png" width="30" className="d-inline-block align-text-top" />
            {' '}
            <span className="text-white">Cleaning Master</span>
          </a>
          <button className="pos navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className={typeof page !== 'undefined' && page === 'services' ? 'active' : 'nav-item'}>
                <Link className="nav-link text-white" to="/uslugi">Usługi</Link>
              </li>
              <li className={typeof page !== 'undefined' && page === 'contact' ? 'active' : 'nav-item'}>
                <Link className="nav-link text-white" to="/kontakt">Kontakt</Link>
              </li>
              <li className={typeof page !== 'undefined' && page === 'users' ? 'active' : 'nav-item'}>
                <Link className="nav-link text-white" to="/uzytkownicy">Użytkownicy</Link>
              </li>
              <li className={typeof page !== 'undefined' && page === 'invoicesData' ? 'active' : 'nav-item'}>
                <Link className="nav-link text-white" to={Endpoints.INVOICES_DATA}>Dane do faktur</Link>
              </li>
              <li className={typeof page !== 'undefined' && page === 'invoices' ? 'active' : 'nav-item'}>
                <Link className="nav-link text-white" to="/faktury">Faktury</Link>
              </li>
              <li className={typeof page !== 'undefined' && page === 'teams' ? 'active' : 'nav-item'}>
                <Link className="nav-link text-white" to="/zespoly">Zespoły</Link>
              </li>
              <li className={typeof page !== 'undefined' && page === 'clients' ? 'active' : 'nav-item'}>
                <Link className="nav-link text-white" to="/klienci">Klienci</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              {!userContext.token ? (<NotSignedIn />) : (<SignedIn />)}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
