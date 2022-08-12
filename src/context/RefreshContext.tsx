import { createContext, useState, FC, useMemo } from "react"
import { IReactChildProps, TRefreshContext } from "../interfaces";

const RefreshContext = createContext<TRefreshContext>({
  refreshContext: {
    refreshId: ""
  },
  setRefreshContext: () => { }
})

RefreshContext.displayName = 'RefreshContext';

const initialState = {
  refreshId: ""
};

const RefreshProvider: FC<IReactChildProps> = (props) => {
  const [refreshContext, setRefreshContext] = useState(initialState);

  const value = useMemo(
    () => ({ refreshContext, setRefreshContext }),
    [refreshContext]
  );

  return (
    <RefreshContext.Provider value={value} >
      {props.children}
    </RefreshContext.Provider >
  )
}

export { RefreshContext, RefreshProvider }