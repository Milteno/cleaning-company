import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Endpoints } from '../../../app/constans';
import { IService, IServicesState } from '../../../interfaces';

interface IClientTiles {
  data: IServicesState["services"];
}

export const ClientTiles: FC<IClientTiles> = ({ data }) => {
  const navigate = useNavigate();
  const navigateToAddService = (id: IService["_id"]) => navigate(`${Endpoints.EDIT_SERVICES}/${id}`);

  console.log("data: ", data);

  const getImage = (unitPrice: IService["service_unit_price"]): string => {
    if (unitPrice === 6) {
      return "/images/basic.jpg";
    }
    if (unitPrice === 8) {
      return "/images/full.jpg";
    }
    return "/images/premium.jpg";
  }

  const translateStatus = (status: IService["status"]) => {
    const map = new Map();
    map.set("CREATED", "Zarezerwowane");
    map.set("PAID", "Opłacone");
    map.set("ASSIGNED_TO_TEAM", "Przypisano zespół");
    map.set("IN_PROGRESS", "W trakcie realizacji");
    map.set("DONE", "Ukończone");

    return map.get(status);
  }

  return (<>
    {data && data.map((element) => (
      <div onClick={() => navigateToAddService(element._id)} className="cursor-pointer border rounded-3 col-12 col-md-6 col-lg-4 p-4">
        <div>
          <img src={getImage(element.service_unit_price)} alt="Pakiet basic" width="250" />
        </div>
        <h4 className="mt-2">{element.service_address}</h4>
        <p>Cena: {element.service_area * element.service_unit_price} PLN</p>
        <p>Status: {translateStatus(element.status)}</p>
      </div>
    ))}
  </>)
}