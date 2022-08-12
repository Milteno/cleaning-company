import { FC } from "react";
import { Table } from "react-bootstrap"
import { Endpoints } from "../../../app/constans"
import { IServicesState } from "../../../interfaces";
import { ActionButtons } from "../../links/ActionButtons"

interface IEmployeeTable {
  data: IServicesState["services"];
}

export const EmployeeTable: FC<IEmployeeTable> = ({ data }) => {
  return (<Table responsive striped bordered hover>
    <thead>
      <tr>
        <th>Adres</th>
        <th>Powierzchnia [m<sup>2</sup>]</th>
        <th>Cena jednostkowa [PLN/m<sup>2</sup>]</th>
        <th>Cena całkowita [PLN]</th>
        <th>Opis</th>
        <th>Status</th>
        <th>Id zespołów</th>
        <th>Id użytkownika</th>
        <th>Id faktury</th>
        <th>Akcje</th>
      </tr>
    </thead>
    <tbody>
      {data && data.map((element) => (
        <tr key={element._id.toString()}>
          <th>{element.service_address}</th>
          <th>{element.service_area}</th>
          <th>{element.service_unit_price}</th>
          <th>{element.service_area.valueOf() * element.service_unit_price.valueOf()}</th>
          <th>{element.description}</th>
          <th>{element.status}</th>
          <th>{element.teams_id}</th>
          <th>{element.user_id}</th>
          <th>{element.invoice_id}</th>
          <th><ActionButtons id={element._id} endpoint={Endpoints.SERVICES} /></th>
        </tr>))
      }
    </tbody>
  </Table>)
}