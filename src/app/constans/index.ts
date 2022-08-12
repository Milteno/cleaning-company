export const API_URL = 'http://localhost:8081';

export enum FetchingDataStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  FAILED = 'failed'
}

export enum UserRoles {
  ADMIN = "Administrator",
  USER = "Pracownik",
  CLIENT = "Klient"
}

export enum Endpoints {
  HOME_PAGE = "/",
  INVOICES_DATA = "/dane_do_faktur",
  ADD_INVOICES_DATA = "/dane_do_faktur/dodaj",
  EDIT_INVOICES_DATA = "/dane_do_faktur/edytuj",
  INVOICES = "/faktury",
  ADD_INVOICES = "/faktury",
  USERS = "/users",
  ACCOUNT = "/me",
  SERVICES = "/uslugi",
  ADD_SERVICES = "/uslugi/dodaj",
  EDIT_SERVICES = "/uslugi/edytuj",
  CLIENTS = "/klienci",
  TEAMS = "/zespoly",
  ADD_TEAMS = "/zespoly/dodaj",
  EDIT_TEAMS = "/zespoly/edytuj",
  ALL_USERS = "/uzytkownicy",
  LOGIN_PAGE = "/logowanie",
}

export const GENERIC_ERROR_MESSAGE = "Coś poszło nie tak.";
export const INVALID_DATA_MESSAGE = "Pola nie zostały poprawnie wypełnione!";
export const INVALID_CREDENTIALS_MESSAGE = "Nieprawidłowy email lub hasło!";