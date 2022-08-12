import { API_URL, Endpoints, FetchingDataStatus } from "../../../app/constans";
import { IOption, IUser } from "../../../interfaces";

type TEmployeeOptionType = Pick<IUser, "_id" | "firstName" | "lastName">;

interface IUsersIdsState {
  employees: TEmployeeOptionType[];
  status: FetchingDataStatus;
}

type TFetchDataArg = (arg: any) => void;

function fetchUserDataOptions<T>(setStatus: TFetchDataArg, options: RequestInit): Promise<T> {
  return fetch(API_URL + Endpoints.ADD_TEAMS, options)
    .then(res => res.json())
    .catch(error => {
      console.log("Błąd: ", error);
      setStatus(FetchingDataStatus.FAILED);
    })
    .finally(() => {
      setStatus(FetchingDataStatus.IDLE);
    });
}

function mapResults(data: IUsersIdsState["employees"]): IOption[] {
  return data.map((element) => ({ value: element._id, label: `${element.firstName} ${element.lastName}` }))
}

export { fetchUserDataOptions, mapResults };

