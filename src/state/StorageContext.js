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
};

export default function StorageContextProvider({ children }) {
  const { mySky, user } = React.useContext(AuthContext);
  const [state, setState] = React.useState(initialState);
  const { dapps, isStorageProcessing } = state;

  const refreshStorage = React.useCallback(async () => {
    try {
      const { data } = await mySky.getJSON(`${dataDomain}/dapps`);
      const dapps = schema.current.Schema.cast(data);

      // TODO: will need migration here instead of dropping all previous data
      if (!schema.current.Schema.isValidSync(dapps)) {
        throw new Error("/dapps response does not match current data schema");
      }

      setState((state) => ({ ...state, isStorageInitialised: true, dapps: dapps.elements }));
    } catch (error) {
      console.log(error.message);

      // no dapps yet or schema invalid, dapps should be empty
      setState((state) => ({ ...state, isStorageInitialised: true, dapps: [] }));
    }
  }, [mySky, setState]);

  const persistStorage = React.useCallback(
    async (dapps) => {
      try {
        const { elements } = schema.current.Schema.cast({ elements: dapps });

        await mySky.setJSON(`${dataDomain}/dapps`, elements);

        setState((state) => ({ ...state, dapps: elements }));
      } catch (error) {
        toast.warning(error.message);

        await refreshStorage();
      }
    },
    [mySky, setState, refreshStorage]
  );

  const removeDapp = React.useCallback(
    async (id) => {
      if (isStorageProcessing) {
        toast.error(storageConsistencyMessage);
        return;
      }

      setState((state) => ({ ...state, isStorageProcessing: true }));

      await persistStorage(dapps.filter((dapp) => dapp.id !== id));

      setState((state) => ({ ...state, isStorageProcessing: false }));
    },
    [isStorageProcessing, dapps, persistStorage]
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
        await persistStorage([...dapps, dapp]);
      } else {
        if (dapp.skylink !== dapps[index].skylink) {
          dapp.skylinkHistory = [...dapp.skylinkHistory, { skylink: dapps[index].skylink }];
        }

        await persistStorage([...dapps.slice(0, index), dapp, ...dapps.slice(index + 1)]);
      }

      setState((state) => ({ ...state, isStorageProcessing: false }));
    },
    [isStorageProcessing, dapps, persistStorage]
  );

  const storageContext = React.useMemo(() => {
    return { ...state, removeDapp, updateDapp };
  }, [state, removeDapp, updateDapp]);

  React.useEffect(() => {
    (async () => {
      if (user) await refreshStorage();
      else setState(initialState);
    })();
  }, [user, setState, refreshStorage]);

  return <StorageContext.Provider value={storageContext}>{children}</StorageContext.Provider>;
}
