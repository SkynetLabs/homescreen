import * as React from "react";
import skynetClient from "../services/skynetClient";
import { Permission, PermCategory, PermType } from "skynet-js";

// use homeapp.hns for dataDomain
const dataDomain = "homeapp.hns";

const transformSkapps = async (skapps) => {
  return Promise.all(
    skapps.map(async (skapp) => ({
      ...skapp,
      skylinkUrl: await skynetClient.getSkylinkUrl(skapp.skylink, { subdomain: true }),
    }))
  );
};

export const SkynetContext = React.createContext();

export default function SkynetContextProvider({ children }) {
  const [state, setState] = React.useState({
    skynetClient,
    mySky: null,
    mySkyInitialising: false,
    authenticating: false,
    user: null,
    skapps: [],
    refreshingSkapps: false,
  });

  React.useEffect(() => {
    const execute = async () => {
      setState((state) => ({ ...state, mySkyInitialising: true }));

      // initialize MySky
      const mySky = await skynetClient.loadMySky(dataDomain);

      // Grab current domain for requesting permissions
      const currentDomain = await skynetClient.extractDomain(window.location.href);

      // Request Discoverable Write permissions
      // This is in addition to Hidden Read and Write requested through initializing with the dataDomain
      await mySky.addPermissions(new Permission(currentDomain, dataDomain, PermCategory.Discoverable, PermType.Write));

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

  const { user } = state;

  React.useEffect(() => {
    (async () => {
      if (user && state.mySky) {
        setState((state) => ({ ...state, skapps: [] }));

        try {
          const { data: skapps } = await state.mySky.getJSON(`${dataDomain}/skapps`);

          if (skapps) {
            setState((state) => ({ ...state, skapps }));
          }
        } catch (error) {
          // no skapps yet
        }
      }
    })();
  }, [user, state.mySky]);

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

  const setSkapps = React.useCallback(
    async (skapps) => {
      try {
        await state.mySky.setJSON(`${dataDomain}/skapps`, skapps);

        const transformed = await transformSkapps(skapps);

        setState((state) => ({ ...state, skapps: transformed }));

        return true;
      } catch (error) {
        console.log(error);

        const { data: skapps } = await state.mySky.getJSON(`${dataDomain}/skapps`);

        if (skapps) {
          const transformed = await transformSkapps(skapps);

          setState((state) => ({ ...state, skapps: transformed }));
        } else if (state.skapps.length) {
          setState((state) => ({ ...state, skapps: [] }));
        }

        return false;
      }
    },
    [state]
  );

  const updateSkapp = React.useCallback(
    async (skylink, skapp) => {
      if (skylink) {
        if (skapp) {
          const index = state.skapps.findIndex((s) => s.skylink === skylink);

          if (index === -1) {
            return setSkapps([skapp, ...state.skapps]);
          }

          return setSkapps([...state.skapps.slice(0, index), skapp, ...state.skapps.slice(index + 1)]);
        }

        return setSkapps(state.skapps.filter((s) => s.skylink !== skylink));
      }

      return setSkapps([skapp, ...state.skapps]);
    },
    [state, setSkapps]
  );

  const stateContext = React.useMemo(() => {
    return { ...state, authenticate, logout, setSkapps, updateSkapp };
  }, [state, authenticate, logout, setSkapps, updateSkapp]);

  // useEffect(() => {
  //   if (userID) {
  //     userProfile.getProfile(userID).then((result) => {
  //       setProfile(result);
  //     });
  //   } else {
  //     setProfile(null);
  //   }
  // }, [userID]);

  // const refreshUser = () => {
  //   if (userID) {
  //     userProfile.getProfile(userID).then((result) => {
  //       setProfile(result);
  //     });
  //   } else {
  //     setProfile(null);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("focus", refreshUser);
  //   return () => {
  //     window.removeEventListener("focus", refreshUser);
  //   };
  // });

  // useEffect(() => {
  //   // define async setup function
  //   async function initMySky() {
  //     try {
  //       // load invisible iframe and define app's data domain
  //       // needed for permissions write
  //       // load necessary DACs and permissions
  //       // Uncomment line below to load DACs
  //       // await mySky.loadDacs(contentRecord);
  //       await mySky.loadDacs(userProfile);
  //       // await mySky.loadDacs(userProfile, socialDAC);
  //       // replace mySky in state object
  //       // setSkynetState({ ...skynetState, mySky, userProfile });
  //       setMySky(mySky);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }

  //   // call async setup function
  //   if (!mySky) {
  //     initMySky();
  //   }

  //   return () => {
  //     if (mySky) {
  //       mySky.destroy();
  //       setMySky(null);
  //     }
  //   };
  // }, [mySky]);

  return <SkynetContext.Provider value={stateContext}>{children}</SkynetContext.Provider>;
}
