import ReactDOM from 'react-dom';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';
import { act, waitForElement } from '@testing-library/react';
import { UserRoles } from '../../../app/constans';
import { renderedComponent } from '../../../app/utils/testUtils';
import { registerIcons } from '../../../app/utils/faIconsLibrary';

registerIcons();

const initialState = {
  details: {
    _id: "id",
    username: "klient@wp.pl",
    email: "klient@wp.pl",
    role_id: UserRoles.CLIENT,
    firstName: "Adam",
    lastName: "Kowalski",
  },
  token: 'token',
}

describe('Loading spinner', () => {
  it('should be visible', () => {
    let node: HTMLDivElement;

    act(() => {
      node = document.createElement("div");
      document.body.appendChild(node);

      ReactDOM.render(renderedComponent(initialState, "/uzytkownicy"), node)
    })

    const loadingSpinner = document.querySelector("div[role='status']");

    expect(loadingSpinner).not.toBeNull();
    expect(loadingSpinner).toBeInTheDocument();
    expect(loadingSpinner?.textContent).toContain("Loading");
  })
})

describe('Error handling', () => {
  let originFetch: any;

  beforeEach(() => {
    originFetch = (global as any).fetch;
  });

  afterEach(() => {
    (global as any).fetch = originFetch;
  });

  it('should show permission error message', async () => {
    const fakeResponse = { status: "Permission error" };
    const mRes = { json: jest.fn().mockResolvedValueOnce(fakeResponse) };
    const mockedFetch = jest.fn().mockResolvedValueOnce(mRes as any);
    (global as any).fetch = mockedFetch;

    let node: HTMLDivElement;
    act(() => {
      node = document.createElement("div");
      document.body.appendChild(node);

      ReactDOM.render(renderedComponent(initialState, "/uzytkownicy"), node)
    })

    const message = await waitForElement(() => document.querySelector(".alert-danger"));

    expect(message).not.toBeNull();
    expect(message).toBeInTheDocument();
    expect(mockedFetch).toBeCalledTimes(1);
    expect(mRes.json).toBeCalledTimes(1);
    expect(message?.textContent).toContain("Nie masz uprawnień do wyświetlenia zawartości tej strony!");
  });

  it('should show message about empty data array', async () => {
    const emptyResponse: any[] = [];
    const mRes = { json: jest.fn().mockResolvedValueOnce(emptyResponse) };
    const mockedFetch = jest.fn().mockResolvedValueOnce(mRes as any);
    (global as any).fetch = mockedFetch;

    let node: HTMLDivElement;
    act(() => {
      node = document.createElement("div");
      document.body.appendChild(node);

      ReactDOM.render(renderedComponent(initialState, "/uzytkownicy"), node)
    })

    const message = await waitForElement(() => document.querySelector(".table-heading"));

    expect(message).not.toBeNull();
    expect(message).toBeInTheDocument();
    expect(mockedFetch).toBeCalledTimes(1);
    expect(mRes.json).toBeCalledTimes(1);
    expect(message?.textContent).toContain("Zarejestrowani użytkownicy");
  });

  it('should show data in array', async () => {
    const response: any[] = [{ "firstName": "Fire", "lastName": "Fox", "authStrategy": "local", "role_id": "Klient", "_id": "61e33665c6db3747540e4068", "username": "firefox@wp.pl", "__v": 241 }];
    const mRes = { json: jest.fn().mockResolvedValueOnce(response) };
    const mockedFetch = jest.fn().mockResolvedValueOnce(mRes as any);
    (global as any).fetch = mockedFetch;

    let node: HTMLDivElement;
    act(() => {
      node = document.createElement("div");
      document.body.appendChild(node);

      ReactDOM.render(renderedComponent(initialState, "/uzytkownicy"), node)
    })

    const message = await waitForElement(() => document.querySelector("table"));

    expect(message).not.toBeNull();
    expect(message).toBeInTheDocument();
    expect(mockedFetch).toBeCalledTimes(1);
    expect(mRes.json).toBeCalledTimes(1);
    expect(message?.textContent).toContain("firefox@wp.pl");
  });
});
