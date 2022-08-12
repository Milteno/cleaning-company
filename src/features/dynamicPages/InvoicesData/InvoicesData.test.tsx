import ReactDOM from 'react-dom';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';
import { act, waitForElement } from '@testing-library/react';
import { UserRoles } from '../../../app/constans';
import { renderedComponent } from '../../../app/utils/testUtils';

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

      ReactDOM.render(renderedComponent(initialState, "/dane_do_faktur"), node)
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

      ReactDOM.render(renderedComponent(initialState, "/dane_do_faktur"), node)
    })

    const message = await waitForElement(() => document.querySelector(".alert-danger"));

    expect(message).not.toBeNull();
    expect(message).toBeInTheDocument();
    expect(mockedFetch).toBeCalledTimes(1);
    expect(mRes.json).toBeCalledTimes(1);
    expect(message?.textContent).toContain("Nie masz uprawnień do wyświetlenia zawartości tej strony!");
  });
});
