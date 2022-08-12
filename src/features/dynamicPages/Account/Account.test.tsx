import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import ReactDOM from 'react-dom';
import { UserRoles } from '../../../app/constans';
import { renderedComponent } from '../../../app/utils/testUtils';

const initialState = {
  details: {
    _id: "id",
    username: "admin@wp.pl",
    email: "admin@wp.pl",
    role_id: UserRoles.ADMIN,
    firstName: "Adam",
    lastName: "Kowalski",
  },
  token: 'token',
}

describe("First test", () => {
  let node: HTMLDivElement;
  beforeEach(() => {
    node = document.createElement("div");
    document.body.appendChild(node);
  })

  afterEach(() => {
    document.body.removeChild(node);
    node = null!;
  })

  it('renders home page logged in header', () => {
    act(() => {
      ReactDOM.render(renderedComponent(initialState, "/me"), node)
    })

    const helloMessage = document.querySelector(".card-text");

    expect(helloMessage).not.toBeNull();
    expect(helloMessage).toBeInTheDocument();
    expect(helloMessage?.textContent).toContain("Adam Kowalski!Rola: Administrator");
  });
})
