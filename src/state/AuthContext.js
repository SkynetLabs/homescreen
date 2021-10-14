import * as React from "react";
import skynetClient from "../services/skynetClient";

export const dataDomain = "homescreen.hns";
export const AuthContext = React.createContext();

export default function SkynetContextProvider({ children }) {
  const [state, setState] = React.useState({
    mySky: null,
    mySkyInitialising: false,
    authenticating: false,
    user: null,
  });

  React.useEffect(() => {
    const execute = async () => {
      setState((state) => ({ ...state, mySkyInitialising: true }));

      // initialize MySky
      const mySky = await skynetClient.loadMySky(dataDomain);

      try {
        const isAuthenticated = await mySky.checkLogin();

        if (isAuthenticated) {
          setState((state) => ({ ...state, authenticating: true }));

          const user = await mySky.userID();

          setState((state) => ({ ...state, user, mySky, mySkyInitialising: false, authenticating: false }));
        } else {
          setState((state) => ({ ...state, mySky, mySkyInitialising: false }));
        }
      } catch {
        setState((state) => ({ ...state, mySky, mySkyInitialising: false, authenticating: false }));
      }
    };

    if (!state.mySky && !state.mySkyInitialising) {
      execute();
    }
  }, [state]);

  const authenticate = React.useCallback(() => {
    const execute = async () => {
      const success = await state.mySky.requestLoginAccess();

      if (success) {
        const user = await state.mySky.userID();

        setState((state) => ({ ...state, user, authenticating: false }));
      } else {
        setState((state) => ({ ...state, authenticating: false }));
      }
    };

    if (state.mySky && !state.authenticating) {
      setState((state) => ({ ...state, authenticating: true }));
      execute();
    }
  }, [state]);

  const logout = React.useCallback(() => {
    if (state.mySky) {
      state.mySky.logout();

      setState((state) => ({ ...state, user: null }));
    }
  }, [state]);

  const stateContext = React.useMemo(() => {
    return { ...state, authenticate, logout };
  }, [state, authenticate, logout]);

  return <AuthContext.Provider value={stateContext}>{children}</AuthContext.Provider>;
}
