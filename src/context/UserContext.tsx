import { createContext, useState, FC, useMemo } from "react"
import { IReactChildPropsUserContext, TUserContext } from "../interfaces";

const UserContext = createContext<TUserContext>({
  userContext: {},
  setUserContext: () => { }
})

UserContext.displayName = 'UserContext';

const UserProvider: FC<IReactChildPropsUserContext> = ({ initialState: initialState, ...props }) => {
  const [userContext, setUserContext] = useState(initialState);

  const value = useMemo(
    () => ({ userContext, setUserContext }),
    [userContext]
  );

  return (
    <UserContext.Provider value={value} >
      {props.children}
    </UserContext.Provider >
  )
}

export { UserContext, UserProvider }