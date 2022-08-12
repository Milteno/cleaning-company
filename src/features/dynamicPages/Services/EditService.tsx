import { FC, useState, useEffect, FormEvent, ChangeEvent, useContext } from "react";
import { Alert, Form, FormGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Select, { ActionMeta, SingleValue } from "react-select";
import { v4 as uuidv4 } from "uuid";
import { API_URL, Endpoints, FetchingDataStatus, UserRoles } from "../../../app/constans";
import { getOptions, putOptions } from "../../../app/utils";
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

interface IComponentState {
  data: Partial<IService>;
  status: FetchingDataStatus;
}

const statuses = ["CREATED", "PAID", "ASSIGNED_TO_TEAM", "IN_PROGRESS", "DONE"];
const statusSelectOptions = statuses.map(elem => ({ value: elem, label: elem }));

export const EditService: FC = () => {
  const [data, setData] = useState<IComponentState["data"]>({});
  const [status, setStatus] = useState<IComponentState["status"]>(FetchingDataStatus.IDLE);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatusOption, setSelectedStatusOption] = useState<IOptionForSelectState["selectedOption"]>(null);
  const [selectedInvoiceOption, setSelectedInvoiceOption] = useState<IOptionForSelectState["selectedOption"]>(null);
  const [selectedUserOption, setSelectedUserOption] = useState<IOptionForSelectState["selectedOption"]>(null);
  const [selectedTeamOption, setSelectedTeamOption] = useState<IOptionForSelectState["selectedOption"]>(null);
  const [invoicesDataOptions, setInvoicesDataOptions] = useState<IOption[]>([]);
  const [usersDataOptions, setUsersDataOptions] = useState<IOption[]>([]);
  const [teamsDataOptions, setTeamsDataOptions] = useState<IOption[]>([]);
  const { setRefreshContext } = useContext(RefreshContext);
  const { userContext } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setStatus(FetchingDataStatus.LOADING);

    fetch(`${API_URL}${Endpoints.EDIT_SERVICES}/${id}`, getOptions(userContext.token))
      .then(res => res.json())
      .then((result) => {
        console.log("data: ", result);
        setData(result);
        const userOption: IOption = ({ label: result?.user_id, value: result?.user_id });
        const teamOption: IOption = ({ label: result?.teams_id[0], value: result?.teams_id[0] });
        const invoiceOption: IOption = ({ label: result?.invoice_id, value: result?.invoice_id });
        const statusOption: IOption = ({ label: result?.status, value: result?.status });
        setSelectedUserOption(userOption);
        setSelectedTeamOption(teamOption);
        setSelectedInvoiceOption(invoiceOption);
        setSelectedStatusOption(statusOption);

        async function fetchMyAPI() {
          const result = await fetchOptionsForServices<IAddService>(setStatus, getOptions(userContext.token));
          const invoices = result?.invoices.map((element: IInvoice) => ({ label: element._id, value: element._id }));
          const users = result?.users.map((element: IUser) => ({ label: element.username, value: element._id }));
          const teams = result?.teams.map((element: ITeam) => ({ label: element.name, value: element._id }));
          setInvoicesDataOptions(invoices);
          setUsersDataOptions(users);
          setTeamsDataOptions(teams);
        }

        fetchMyAPI()
      })
      .catch(error => {
        console.log("Błąd: ", error);
        setStatus(FetchingDataStatus.FAILED);
      })
      .finally(() => {
        setStatus(FetchingDataStatus.IDLE);
      });

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

    if (service_address && service_area && service_unit_price && description && selectedInvoiceOption !== null && selectedUserOption !== null && selectedTeamOption !== null && selectedStatusOption !== null) {
      const body = JSON.stringify({
        invoice_id: selectedInvoiceOption["value"],
        user_id: selectedUserOption["value"],
        teams_id: selectedTeamOption["value"],
        service_address: service_address,
        service_area: service_area,
        service_unit_price: service_unit_price,
        description: description,
        status: selectedStatusOption["value"]
      })

      fetch(`${API_URL}${Endpoints.EDIT_SERVICES}/${id}`, { ...putOptions, body: body })
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
      <h1 id="table-heading">Edycja zarezerwowanej usługi</h1>
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
        {userContext.details?.role_id === UserRoles.CLIENT ? (<FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Cena jednostkowa [PLN/m<sup>2</sup>]</Form.Label>
          <Form.Control
            type="number"
            placeholder="Cena za metr kwadratowy"
            onChange={e => handleChange(e, "service_unit_price")}
            value={data.service_unit_price}
            disabled
          />
        </FormGroup>) :
          (<FormGroup
            className="text-start mb-3">
            <Form.Label className="fw-bold">Cena jednostkowa [PLN/m<sup>2</sup>]</Form.Label>
            <Form.Control
              type="number"
              placeholder="Cena za metr kwadratowy"
              onChange={e => handleChange(e, "service_unit_price")}
              value={data.service_unit_price}
            />
          </FormGroup>)}
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
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Status</Form.Label>
          <Select
            value={selectedStatusOption}
            onChange={(newValue, actionMeta) => handleSingleSelectChange(newValue, actionMeta, setSelectedStatusOption)}
            options={statusSelectOptions}
            isDisabled={userContext.details?.role_id === UserRoles.CLIENT}
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
            isDisabled={userContext.details?.role_id === UserRoles.CLIENT}
          />
        </FormGroup>
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Zespół</Form.Label>
          <Select
            value={selectedTeamOption}
            onChange={(newValue, actionMeta) => handleSingleSelectChange(newValue, actionMeta, setSelectedTeamOption)}
            options={teamsDataOptions}
            isDisabled={userContext.details?.role_id === UserRoles.CLIENT}
          />
        </FormGroup>
        <SaveButton isSubmitting={isSubmitting} endpoint={Endpoints.SERVICES} />
      </form>
    </>
  );
}
