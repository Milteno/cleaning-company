import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { store } from './app/store';
import App from './App';
import { Endpoints, UserRoles } from './app/constans';
import { renderWithContext } from './app/utils/testUtils';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

test('renders home page not logged in header', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const helloMessage = screen.queryByText('Zalogowano jako admin@wp.pl');
  const logoutButton = screen.queryByText('Wyloguj');

  expect(helloMessage).not.toBeInTheDocument();
  expect(logoutButton).not.toBeInTheDocument();
  expect(getByText(/logowanie/i)).toBeInTheDocument();
  expect(getByText(/rejestracja/i)).toBeInTheDocument();
});

test('renders home page logged in header', () => {
  renderWithContext((<App />), initialState);

  const helloMessage = screen.queryByText('Zalogowano jako admin@wp.pl');
  const logoutButton = screen.queryByText('Wyloguj');
  const loginButton = screen.queryByText('Logowanie');
  const registerButton = screen.queryByText('Rejestracja');

  expect(helloMessage).toBeInTheDocument();
  expect(logoutButton).toBeInTheDocument();
  expect(loginButton).not.toBeInTheDocument();
  expect(registerButton).not.toBeInTheDocument();
});

test('renders home page services', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(getByText(/nasze pakiety usług/i)).toBeInTheDocument();
});
