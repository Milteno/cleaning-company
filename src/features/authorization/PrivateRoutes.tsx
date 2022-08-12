import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { IUser } from '../../interfaces';

export const PrivateRoutes = ({ role }: { role: IUser["role_id"] }) => {
  const location = useLocation();
  const { userContext } = useContext(UserContext);

  // TODO use role in Navigate: userContext.details?.role_id === role
  return userContext.token
    ? <Outlet />
    : <Navigate to="/logowanie" replace state={{ from: location }} />;
}