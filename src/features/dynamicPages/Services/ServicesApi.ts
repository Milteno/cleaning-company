import { FetchingDataStatus, API_URL, Endpoints } from "../../../app/constans";

type TFetchDataArg = (arg: any) => void;

function fetchOptionsForServices<T>(setStatus: TFetchDataArg, options: RequestInit): Promise<T> {
  return fetch(API_URL + Endpoints.ADD_SERVICES, options)
    .then(res => res.json())
    .catch(error => {
      console.log("Błąd: ", error);
      setStatus(FetchingDataStatus.FAILED);
    })
    .finally(() => {
      setStatus(FetchingDataStatus.IDLE);
    });
}

export { fetchOptionsForServices };

