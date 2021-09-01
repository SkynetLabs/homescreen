import * as React from "react";
import { toast } from "react-toastify";
import schema from "../schema";
import { AuthContext } from "./AuthContext";

export const dataDomain = "homeapp.hns";
export const StorageContext = React.createContext();

// const consistencyException = new Error("Storage is already processing a request, you can retry once it's finished");
const storageConsistencyMessage = "Storage is already processing a request, you can retry once it's finished";

const initialState = {
  isStorageInitialised: false,
  isStorageProcessing: false,
  skapps: [],
  grid: null,
};

export default function StorageContextProvider({ children }) {
  const { mySky, user } = React.useContext(AuthContext);
  const [state, setState] = React.useState(initialState);
  const { skapps, isStorageProcessing } = state;

  const refreshSkapps = React.useCallback(async () => {
    try {
      const { data } = await mySky.getJSON(`${dataDomain}/skapps`);

      // TODO: will need migration here instead of dropping all previous data
      if (!schema.current.SkappsSchema.isValidSync(data)) {
        throw new Error("/skapps response does not match current data schema");
      }

      setState((state) => ({ ...state, isStorageInitialised: true, skapps: data.element }));
    } catch (error) {
      console.log(error.message);

      // no skapps yet or schema invalid, skapps should be empty
      setState((state) => ({ ...state, isStorageInitialised: true, skapps: [] }));
    }
  }, [mySky, setState]);

  const persistSkapps = React.useCallback(
    async (skapps) => {
      try {
        const data = schema.current.SkappsSchema.cast({ element: skapps });

        await mySky.setJSON(`${dataDomain}/skapps`, data);

        setState((state) => ({ ...state, skapps: data.element }));
      } catch (error) {
        toast.warning(error.message);

        await refreshSkapps();
      }
    },
    [mySky, setState, refreshSkapps]
  );

  const removeSkapp = React.useCallback(
    async (id) => {
      if (isStorageProcessing) {
        toast.error(storageConsistencyMessage);
        return;
      }

      setState((state) => ({ ...state, isStorageProcessing: true }));

      await persistSkapps(skapps.filter((skapp) => skapp.id !== id));

      setState((state) => ({ ...state, isStorageProcessing: false }));
    },
    [isStorageProcessing, skapps, persistSkapps]
  );

  const updateSkapp = React.useCallback(
    async (skapp) => {
      if (isStorageProcessing) {
        toast.error(storageConsistencyMessage);
        return;
      }

      setState((state) => ({ ...state, isStorageProcessing: true }));

      const index = skapps.findIndex(({ id }) => skapp.id === id);

      if (index === -1) {
        await persistSkapps([...skapps, skapp]);
      } else {
        await persistSkapps([...skapps.slice(0, index), skapp, ...skapps.slice(index + 1)]);
      }

      setState((state) => ({ ...state, isStorageProcessing: false }));
    },
    [isStorageProcessing, skapps, persistSkapps]
  );

  const storageContext = React.useMemo(() => {
    return { ...state, removeSkapp, updateSkapp };
  }, [state, removeSkapp, updateSkapp]);

  React.useEffect(() => {
    (async () => {
      if (user) await refreshSkapps();
      else setState(initialState);
    })();
  }, [user, setState, refreshSkapps]);

  return <StorageContext.Provider value={storageContext}>{children}</StorageContext.Provider>;
}
