import { FC, useState, useEffect, FormEvent, useRef, ChangeEvent, useContext } from "react";
import { Alert, Form, FormGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Select, { MultiValue, ActionMeta } from "react-select";
import { v4 as uuidv4 } from "uuid";
import { API_URL, Endpoints, FetchingDataStatus } from "../../../app/constans";
import { getOptions, putOptions } from "../../../app/utils";
import { RefreshContext } from "../../../context/RefreshContext";
import { UserContext } from "../../../context/UserContext";
import { IOption, IOptionForMultiSelectState, ITeam, IUser, } from "../../../interfaces";
import { Loader } from "../../links/Loader";
import { SaveButton } from "../../links/SaveButton";
import { fetchUserDataOptions, mapResults } from "./TeamsApi";

interface IComponentState {
  team: Partial<ITeam>;
  status: FetchingDataStatus;
}

type TEmployeeOptionType = Pick<IUser, "_id" | "firstName" | "lastName">;

export const EditTeams: FC = () => {
  const [data, setData] = useState<IComponentState["team"]>({});
  const [status, setStatus] = useState<IComponentState["status"]>(FetchingDataStatus.IDLE);
  const [usersDataOptions, setUsersDataOptions] = useState<IOption[]>([]);
  const [selectedUserOptions, setSelectedUserOptions] = useState<IOptionForMultiSelectState["selectedOptions"]>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setRefreshContext } = useContext(RefreshContext);
  const { userContext } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setStatus(FetchingDataStatus.LOADING);
    fetch(`${API_URL}${Endpoints.EDIT_TEAMS}/${id}`, getOptions(userContext.token))
      .then(res => res.json())
      .then((result: IComponentState["team"]) => {
        const selectedEmployees = result?.employee_id?.map((elem) => ({ label: `${elem.firstName} ${elem.lastName}`, value: elem._id })) || [];
        setData(result);
        setSelectedUserOptions(selectedEmployees);

        async function fetchMyAPI() {
          const response = await fetchUserDataOptions<TEmployeeOptionType[]>(setStatus, getOptions(userContext.token));
          setUsersDataOptions(mapResults(response));
        }

        fetchMyAPI();
      })
      .catch(error => {
        console.log("Błąd: ", error);
        setStatus(FetchingDataStatus.FAILED);
      })
      .finally(() => {
        setStatus(FetchingDataStatus.IDLE);
      });
  }, []);

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const name = data.name;

    console.log("submitting: ", name);
    console.log("data: ", data);

    if (data.name) {
      const ids = selectedUserOptions?.map((element) => element.value);

      const body = JSON.stringify({
        name: name,
        ids: ids
      })

      fetch(`${API_URL}${Endpoints.EDIT_TEAMS}/${id}`, { ...putOptions(userContext.token), body: body })
        .then(res => res.json())
        .then((result) => {
          console.log(result);
          setIsSubmitting(false);
          setRefreshContext({ refreshId: uuidv4() });
          if (result.status === "Success") {
            navigate(Endpoints.TEAMS);
          }
        })
        .catch(error => {
          setIsSubmitting(false);
          console.error(error)
        });
    } else {
      setError("Nazwa zespołu jest wymagana!");
      setIsSubmitting(false);
    }
  }

  const handleUserDataSelectChange = (newValue: MultiValue<IOption>, _: ActionMeta<IOption>): void => {
    setSelectedUserOptions([...newValue]);
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setData({ ...data, name: e.currentTarget.value });
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {status !== FetchingDataStatus.LOADING ? (
        <>
          <h1 className="table-heading">Edycja zespołu</h1>
          <form className="text-start custom-form" onSubmit={handleSubmit}>
            <FormGroup
              className="text-start mb-3">
              <Form.Label className="fw-bold">Nazwa zespołu</Form.Label>
              <Form.Control
                type="text"
                placeholder="Np. Miotełki"
                value={data?.name}
                onChange={handleNameChange} />
            </FormGroup>
            <FormGroup
              className="text-start mb-3">
              <Form.Label className="fw-bold">Pracownicy</Form.Label>
              <Select
                isMulti
                name="employees"
                options={usersDataOptions}
                className="mb-3 basic-multi-select"
                classNamePrefix="select"
                onChange={handleUserDataSelectChange}
                value={selectedUserOptions}
              />
            </FormGroup>
            <SaveButton isSubmitting={isSubmitting} endpoint={Endpoints.TEAMS} />
          </form>
        </>
      ) : (<Loader />)}
    </>
  )
}
