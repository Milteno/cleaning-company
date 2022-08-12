import { FC, useState, useEffect, FormEvent, ChangeEvent, useContext } from "react";
import { Alert, Form, FormGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select, { ActionMeta, SingleValue } from "react-select";
import { v4 as uuidv4 } from "uuid";
import { API_URL, Endpoints, FetchingDataStatus } from "../../../app/constans";
import { getOptions, postOptions } from "../../../app/utils";
import { RefreshContext } from "../../../context/RefreshContext";
import { UserContext } from "../../../context/UserContext";
import { IInvoice, IUser, ITeam, IOption, IOptionForSelectState, IService } from "../../../interfaces";
import { Loader } from "../../links/Loader";
import { SaveButton } from "../../links/SaveButton";
import { fetchOptionsForServices } from "./ServicesApi";

interface IAddService {
  teams: ITeam[];
  users: IUser[];
  invoices: IInvoice[];
}

interface IAddServiceState {
  data: IAddService | null;
  status: FetchingDataStatus;
}

interface IComponentState {
  data: Partial<IService>;
  status: FetchingDataStatus;
}

export const AddService: FC = () => {
  const [data, setData] = useState<IComponentState["data"]>({});
  const [status, setStatus] = useState<IAddServiceState["status"]>(FetchingDataStatus.IDLE);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInvoiceOption, setSelectedInvoiceOption] = useState<IOptionForSelectState["selectedOption"]>(null);
  const [selectedUserOption, setSelectedUserOption] = useState<IOptionForSelectState["selectedOption"]>(null);
  const [selectedTeamOption, setSelectedTeamOption] = useState<IOptionForSelectState["selectedOption"]>(null);
  const [invoicesDataOptions, setInvoicesDataOptions] = useState<IOption[]>([]);
  const [usersDataOptions, setUsersDataOptions] = useState<IOption[]>([]);
  const [teamsDataOptions, setTeamsDataOptions] = useState<IOption[]>([]);
  const { setRefreshContext } = useContext(RefreshContext);
  const { userContext } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setStatus(FetchingDataStatus.LOADING);

    async function fetchMyAPI() {
      const result = await fetchOptionsForServices<IAddService>(setStatus, getOptions(userContext.token));
      const invoices = result?.invoices.map((element: IInvoice) => ({ label: element._id, value: element._id })) || [];
      const users = result?.users.map((element: IUser) => ({ label: element.username, value: element._id })) || [];
      const teams = result?.teams.map((element: ITeam) => ({ label: element.name, value: element._id })) || [];
      setInvoicesDataOptions(invoices);
      setUsersDataOptions(users);
      setTeamsDataOptions(teams);
    }

    fetchMyAPI()
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof IService): void => {
    setError("");
    setData({ ...data, [key]: e.currentTarget.value });
  }

  const handleSingleSelectChange = (newValue: SingleValue<IOption>, _: ActionMeta<IOption>, setSingleSelectValue: Function): void => {
    setError("");
    setSingleSelectValue(newValue);
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const { service_address, service_area, service_unit_price, description } = data;

    if (service_address && service_area && service_unit_price && description && selectedInvoiceOption !== null && selectedUserOption !== null && selectedTeamOption !== null) {
      const body = JSON.stringify({
        invoice: selectedInvoiceOption["value"],
        user: selectedUserOption["value"],
        team: selectedTeamOption["value"],
        address: service_address,
        area: service_area,
        unitPrice: service_unit_price,
        description: description
      })

      fetch(API_URL + Endpoints.ADD_SERVICES, { body: body, ...postOptions(userContext.token) })
        .then(res => res.json())
        .then(result => {
          console.log(result);
          setRefreshContext({ refreshId: uuidv4() });
          navigate(Endpoints.SERVICES);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      setError("Należy uzupełnić wszystkie pola");
      setIsSubmitting(false);
    }
  }

  if (status === FetchingDataStatus.LOADING) {
    return <Loader />
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <h1 id="table-heading">Rezerwacja usługi</h1>
      <form className="text-start custom-form" onSubmit={handleSubmit}>
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Adres</Form.Label>
          <Form.Control
            type="text"
            placeholder="Kod pocztowy, miejscowowść, ulica oraz numer domu/lokalu"
            onChange={e => handleChange(e, "service_address")}
            value={data.service_address}
          />
        </FormGroup>
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Powierzchnia [m<sup>2</sup>]</Form.Label>
          <Form.Control
            type="number"
            placeholder="Powierzchnia lokalu"
            onChange={e => handleChange(e, "service_area")}
            value={data.service_area}
          />
        </FormGroup>
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Cena jednostkowa [PLN/m<sup>2</sup>]</Form.Label>
          <Form.Control
            type="number"
            placeholder="Cena za metr kwadratowy"
            onChange={e => handleChange(e, "service_unit_price")}
            value={data.service_unit_price}
          />
        </FormGroup>
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Opis</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            rows={5}
            placeholder="Opis"
            onChange={e => handleChange(e, "description")}
            value={data.description}
          />
        </FormGroup>
        <Form.Label className="fw-bold">Faktura</Form.Label>
        <FormGroup
          className="text-start mb-3">
          <Select
            value={selectedInvoiceOption}
            onChange={(newValue, actionMeta) => handleSingleSelectChange(newValue, actionMeta, setSelectedInvoiceOption)}
            options={invoicesDataOptions}
          />
        </FormGroup>
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Użytkownik</Form.Label>
          <Select
            value={selectedUserOption}
            onChange={(newValue, actionMeta) => handleSingleSelectChange(newValue, actionMeta, setSelectedUserOption)}
            options={usersDataOptions}
          />
        </FormGroup>
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Zespół</Form.Label>
          <Select
            value={selectedTeamOption}
            onChange={(newValue, actionMeta) => handleSingleSelectChange(newValue, actionMeta, setSelectedTeamOption)}
            options={teamsDataOptions}
          />
        </FormGroup>
        <SaveButton isSubmitting={isSubmitting} endpoint={Endpoints.SERVICES} />
      </form>
    </>
  );
}
