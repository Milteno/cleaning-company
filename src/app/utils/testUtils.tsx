import { ReactElement } from "react";
import { render } from '@testing-library/react';
import { UserProvider } from "../../context/UserContext";
import { IReactChildPropsUserContext } from "../../interfaces";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Account } from "../../features/dynamicPages/Account/Account";
import { HomePage } from "../../features/staticPages/homePage";
import { Login } from "../../features/authorization/login";
import { PrivateRoutes } from "../../features/authorization/PrivateRoutes";
import { Register } from "../../features/authorization/register";
import { Clients } from "../../features/dynamicPages/Clients/Clients";
import { EditClients } from "../../features/dynamicPages/Clients/EditClients";
import { AddInvoice } from "../../features/dynamicPages/Invoices/AddInvoice";
import { EditInvoice } from "../../features/dynamicPages/Invoices/EditInvoice";
import { Invoices } from "../../features/dynamicPages/Invoices/Invoices";
import { AddInvoiceData } from "../../features/dynamicPages/InvoicesData/AddInvoiceData";
import { EditInvoiceData } from "../../features/dynamicPages/InvoicesData/EditInvoicesData";
import { InvoicesData } from "../../features/dynamicPages/InvoicesData/InvoicesData";
import { AddService } from "../../features/dynamicPages/Services/AddService";
import { EditService } from "../../features/dynamicPages/Services/EditService";
import { Services } from "../../features/dynamicPages/Services/Services";
import { AddTeams } from "../../features/dynamicPages/Teams/AddTeam";
import { EditTeams } from "../../features/dynamicPages/Teams/EditTeams";
import { Teams } from "../../features/dynamicPages/Teams/Teams";
import { Users } from "../../features/dynamicPages/Users/Users";
import { ContactPage } from "../../features/staticPages/contactPage";
import { PageNotFound } from "../../features/staticPages/PageNotFound";
import { UserRoles } from "../constans";

export const renderWithContext = (component: ReactElement, initialState: IReactChildPropsUserContext["initialState"]) => {
  return {
    ...render(
      <UserProvider initialState={initialState}>
        {component}
      </UserProvider>
    )
  }
}

export const renderedComponent = (initialState: IReactChildPropsUserContext["initialState"], path: string) => {
  return (<UserProvider initialState={initialState}>
    <MemoryRouter initialEntries={[path]}>
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
    </MemoryRouter>
  </UserProvider>)
}