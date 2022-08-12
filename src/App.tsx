import { useContext, useCallback, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { API_URL, UserRoles } from './app/constans';
import { UserContext } from './context/UserContext';
import { Footer } from './features/partials/footer';
import { Header } from './features/partials/header';
import { Login } from './features/authorization/login';
import { Register } from './features/authorization/register';
import { Account } from './features/dynamicPages/Account/Account';
import { Invoices } from './features/dynamicPages/Invoices/Invoices';
import { AddInvoice } from './features/dynamicPages/Invoices/AddInvoice';
import { EditInvoice } from './features/dynamicPages/Invoices/EditInvoice';
import { Clients } from './features/dynamicPages/Clients/Clients';
import { EditClients } from './features/dynamicPages/Clients/EditClients';
import { Services } from './features/dynamicPages/Services/Services';
import { AddService } from './features/dynamicPages/Services/AddService';
import { EditService } from './features/dynamicPages/Services/EditService';
import { Users } from './features/dynamicPages/Users/Users';
import { ContactPage } from './features/staticPages/contactPage';
import { HomePage } from './features/staticPages/homePage';
import { PageNotFound } from './features/staticPages/PageNotFound';
import { PrivateRoutes } from './features/authorization/PrivateRoutes';
import { Teams } from './features/dynamicPages/Teams/Teams';
import { AddTeams } from './features/dynamicPages/Teams/AddTeam';
import { EditTeams } from './features/dynamicPages/Teams/EditTeams';
import { InvoicesData } from './features/dynamicPages/InvoicesData/InvoicesData';
import { AddInvoiceData } from './features/dynamicPages/InvoicesData/AddInvoiceData';
import { EditInvoiceData } from './features/dynamicPages/InvoicesData/EditInvoicesData';
import { postWithoutCredentialsOptions } from './app/utils';
import './App.css';

function App() {
  const { userContext, setUserContext } = useContext(UserContext);
  const verifyUser = useCallback(() => {
    fetch(API_URL + "/users/refreshToken", postWithoutCredentialsOptions)
      .then(async response => {
        if (response.ok) {
          const data = await response.json();
          console.warn("setUserContext token=data.token because of ok response from /refreshToken");
          setUserContext({ ...userContext, token: data.token });
        } else {
          console.warn("setUserContext token=null because of NOT ok response from /refreshToken");
          setUserContext({ ...userContext, token: null });
        }
        // call refreshToken every 5 minutes to renew the authentication token.
        setTimeout(verifyUser, 5 * 60 * 1000);
      })
  }, [setUserContext]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  const syncLogout = useCallback(event => {
    if (event.key === "logout") {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    }
  }, [syncLogout]);

  return (
    <BrowserRouter>
      <div className={"App"}>
        <Header />
        <Routes>
          <Route index element={<HomePage />} />
          <Route path={"kontakt"} element={<ContactPage />} />
          <Route path={"logowanie"} element={<Login />} />
          <Route path={"rejestracja"} element={<Register />} />
          <Route path="/" element={<PrivateRoutes role={UserRoles.ADMIN} />} >
            <Route path={"me"} element={<Account />} />
            <Route path={"uzytkownicy"} element={<Users />} >
              <Route path={"edytuj/:id"} element={<Users />} />
            </Route>
            <Route path={"dane_do_faktur"} element={<InvoicesData />}>
              <Route path={"dodaj"} element={<AddInvoiceData />} />
              <Route path={"edytuj/:id"} element={<EditInvoiceData />} />
            </Route>
            <Route path={"zespoly"} element={<Teams />}>
              <Route path={"dodaj"} element={<AddTeams />} />
              <Route path={"edytuj/:id"} element={<EditTeams />} />
            </Route>
            <Route path={"faktury"} element={<Invoices />} >
              <Route path={"dodaj"} element={<AddInvoice />} />
              <Route path={"edytuj/:id"} element={<EditInvoice />} />
            </Route>
            <Route path={"uslugi"} element={<Services />} >
              <Route path={"dodaj"} element={<AddService />} />
              <Route path={"edytuj/:id"} element={<EditService />} />
            </Route>
            <Route path={"klienci"} element={<Clients />} >
              <Route path={"edytuj/:id"} element={<EditClients />} />
            </Route>
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
