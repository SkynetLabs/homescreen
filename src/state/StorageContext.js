import * as React from "react";
import { toast } from "react-toastify";
import schema from "../schema";
import { AuthContext } from "./AuthContext";

export const dataDomain = "homescreen.hns";
export const StorageContext = React.createContext();

// const consistencyException = new Error("Storage is already processing a request, you can retry once it's finished");
const storageConsistencyMessage = "Storage is already processing a request, you can retry once it's finished";

const initialState = {
  isStorageInitialised: false,
  isStorageProcessing: false,
  dapps: [],
  grid: null,
};

export default function StorageContextProvider({ children }) {
  const { mySky, user } = React.useContext(AuthContext);
  const [state, setState] = React.useState(initialState);
  const { dapps, isStorageProcessing } = state;

  const refreshDapps = React.useCallback(async () => {
    try {
      const { data } = await mySky.getJSON(`${dataDomain}/dapps`);

      // TODO: will need migration here instead of dropping all previous data
      if (!schema.current.DappsSchema.isValidSync(data)) {
        throw new Error("/dapps response does not match current data schema");
      }

      setState((state) => ({ ...state, isStorageInitialised: true, dapps: data.element }));
    } catch (error) {
      // no dapps yet or schema invalid, dapps should be empty
      setState((state) => ({ ...state, isStorageInitialised: true, dapps: [] }));
    }
  }, [mySky, setState]);

  const persistDapps = React.useCallback(
    async (dapps) => {
      try {
        const data = schema.current.DappsSchema.cast({ element: dapps });

        await mySky.setJSON(`${dataDomain}/dapps`, data);

        setState((state) => ({ ...state, dapps: data.element }));
      } catch (error) {
        toast.warning(error.message);

        await refreshDapps();
      }
    },
    [mySky, setState, refreshDapps]
  );

  const removeDapp = React.useCallback(
    async (id) => {
      if (isStorageProcessing) {
        toast.error(storageConsistencyMessage);
        return;
      }

      setState((state) => ({ ...state, isStorageProcessing: true }));

      await persistDapps(dapps.filter((dapp) => dapp.id !== id));

      setState((state) => ({ ...state, isStorageProcessing: false }));
    },
    [isStorageProcessing, dapps, persistDapps]
  );

  const updateDapp = React.useCallback(
    async (dapp) => {
      if (isStorageProcessing) {
        toast.error(storageConsistencyMessage);
        return;
      }

      setState((state) => ({ ...state, isStorageProcessing: true }));

      const index = dapps.findIndex(({ id }) => dapp.id === id);

      if (index === -1) {
        await persistDapps([...dapps, dapp]);
      } else {
        if (dapp.skylink !== dapps[index].skylink) {
          dapp.skylinkHistory = [...dapp.skylinkHistory, { skylink: dapps[index].skylink }];
        }

        await persistDapps([...dapps.slice(0, index), dapp, ...dapps.slice(index + 1)]);
      }

      setState((state) => ({ ...state, isStorageProcessing: false }));
    },
    [isStorageProcessing, dapps, persistDapps]
  );

  const storageContext = React.useMemo(() => {
    return { ...state, removeDapp, updateDapp };
  }, [state, removeDapp, updateDapp]);

  React.useEffect(() => {
    (async () => {
      if (user) await refreshDapps();
      else setState(initialState);
    })();
  }, [user, setState, refreshDapps]);

  return <StorageContext.Provider value={storageContext}>{children}</StorageContext.Provider>;
}
