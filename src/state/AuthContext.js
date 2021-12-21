import * as React from "react";
import { mySky } from "../services/skynet";

export const AuthContext = React.createContext();

export default function SkynetContextProvider({ children }) {
  const [state, setState] = React.useState({
    mySkyInitialising: false,
    authenticating: false,
    user: null,
  });

  React.useEffect(() => {
    const execute = async () => {
      setState((state) => ({ ...state, mySkyInitialising: true }));

      try {
        const isAuthenticated = await mySky.checkLogin();

        if (isAuthenticated) {
          setState((state) => ({ ...state, authenticating: true }));

          const user = await mySky.userID();

          setState((state) => ({ ...state, user, mySkyInitialising: false, authenticating: false }));
        } else {
          setState((state) => ({ ...state, mySkyInitialising: false }));
        }
      } catch {
        setState((state) => ({ ...state, mySkyInitialising: false, authenticating: false }));
      }
    };

    if (!state.mySkyInitialising) {
      execute();
    }
  }, [state]);

  const authenticate = React.useCallback(() => {
    const execute = async () => {
      const success = await mySky.requestLoginAccess();

      if (success) {
        const user = await mySky.userID();

        setState((state) => ({ ...state, user, authenticating: false }));
      } else {
        setState((state) => ({ ...state, authenticating: false }));
      }
    };

    if (!state.authenticating) {
      setState((state) => ({ ...state, authenticating: true }));
      execute();
    }
  }, [state]);

  const logout = React.useCallback(async () => {
    await mySky.logout();

    setState((state) => ({ ...state, user: null }));
  }, [setState]);

  const stateContext = React.useMemo(() => {
    return { ...state, authenticate, logout };
  }, [state, authenticate, logout]);

  return <AuthContext.Provider value={stateContext}>{children}</AuthContext.Provider>;
}
