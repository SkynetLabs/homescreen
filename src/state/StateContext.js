import * as React from "react";

export const StateContext = React.createContext();

const initialState = {
  editing: null,
};

export default function StateContextProvider({ children }) {
  const [stateContext, setStateContext] = React.useState(initialState);

  const context = React.useMemo(() => {
    return { ...stateContext, setStateContext };
  }, [stateContext, setStateContext]);

  return <StateContext.Provider value={context}>{children}</StateContext.Provider>;
}
