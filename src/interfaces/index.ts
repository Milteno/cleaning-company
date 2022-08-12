import { FetchingDataStatus, UserRoles } from "../app/constans";

export type TEntityId = IClient["_id"] | IUser["_id"] | ITeam["_id"] | IInvoice["_id"] | IInvoicesData["_id"] | IService["_id"]

export interface IClient {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  role_id: UserRoles.CLIENT;
}

export interface IEmployee {
  _id: string;
  firstName: string;
  lastName: string;
  role_id: UserRoles.USER;
}

export interface IClientsState {
  clients: IClient[];
  status: FetchingDataStatus;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  role_id: UserRoles;
  firstName: string;
  lastName: string;
}

export interface IUsersState {
  users: IUser[];
  status: FetchingDataStatus;
}

export interface ITeam {
  _id: string;
  name: string;
  employee_id: IEmployee[];
}

export interface ITeamsState {
  teams: ITeam[];
  status: FetchingDataStatus;
}

export interface IInvoice {
  _id: string;
  is_b2b: boolean;
  invoice_data_id: string;
}

export interface IInvoicesState {
  invoices: IInvoice[];
  status: FetchingDataStatus;
}

export interface IInvoicesData {
  _id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  company_vat_number: string;
  company_address: string;
  company_phone: string;
  company_email: string;
}

export interface IInvoicesDataState {
  invoicesData: IInvoicesData[];
  status: FetchingDataStatus;
}

export interface IService {
  _id: string;
  service_address: string;
  service_area: number;
  service_unit_price: number;
  description: string;
  status: string;
  teams_id: ITeam["_id"][];
  user_id: IUser["_id"];
  invoice_id: IInvoice["_id"];
}

export interface IServicesState {
  services: IService[];
  status: FetchingDataStatus;
}

export interface IOption {
  value: string;
  label: string;
}

export interface IOptionForSelectState {
  selectedOption: IOption | null;
}

export interface IOptionForMultiSelectState {
  selectedOptions: IOption[] | null;
}

export interface IUserContextData {
  token?: string | null;
  details?: IUser | null;
}

export type TUserContext = {
  userContext: IUserContextData;
  setUserContext: (oldValues: IUserContextData) => void;
};

export interface IRefreshContextData {
  refreshId: string;
}

export type TRefreshContext = {
  refreshContext: IRefreshContextData;
  setRefreshContext: (oldValues: IRefreshContextData) => void;
};

export interface IReactChildProps {
  children: JSX.Element;
};

export interface IReactChildPropsUserContext {
  children: JSX.Element;
  initialState: IUserContextData;
};