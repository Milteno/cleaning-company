import { IUserContextData } from "../../interfaces";

const genericOptions = (token: IUserContextData["token"]): RequestInit =>
({
  credentials: "include",
  // Pass authentication token as bearer token in header
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
})

export const getOptions = (token: IUserContextData["token"]): RequestInit =>
({
  method: "GET",
  ...genericOptions(token),
})

export const postOptions = (token: IUserContextData["token"]): RequestInit => ({
  method: "POST",
  ...genericOptions(token),
})

export const putOptions = (token: IUserContextData["token"]): RequestInit =>
({
  method: "PUT",
  ...genericOptions(token),
})

export const deleteOptions = (token: IUserContextData["token"]): RequestInit =>
({
  method: "DELETE",
  ...genericOptions(token),
})

export const postWithoutCredentialsOptions: RequestInit = {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
}
