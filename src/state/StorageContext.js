import * as React from "react";
import { toast } from "react-toastify";
import schema from "../schema";
import { AuthContext } from "./AuthContext";

export const dataDomain = "homescreen.hns";
export const StorageContext = React.createContext();

// const consistencyException = new Error("Storage is already processing a request, you can retry once it's finished");
const storageConsistencyMessage = "Storage is already processing a request, you can retry once it's finished";
const signUpMessage =
  "Thank you for signing up! We have seeded your Homescreen with a couple of apps that might get you started, feel free to manage them in any way you want - this is your personal space.";

const initialState = {
  isStorageInitialised: false,
  isStorageProcessing: false,
  dapps: [],
};

const defaultDapps = [
  {
    resolverSkylink: "AQBbKr6XcwHWB3GGKTcn07Wk2wbezb-OFZIqyMUwMSC-qg",
    skylink: "HAAaF0t_wKIFIfT4n_6hkmbki89thWhNgv3QA5yFBUQHQA",
    skylinks: [{ skylink: "HAAaF0t_wKIFIfT4n_6hkmbki89thWhNgv3QA5yFBUQHQA" }],
    metadata: {
      name: "1inch",
      description: "DeFi / DEX aggregator on Ethereum, Binance Smart Chain, Optimism, Polygon, Arbitrum",
      themeColor: "#1976d2",
      icon: "/assets/icons/icon-72x72.png",
    },
  },
  {
    resolverSkylink: "AQAJGCmM4njSUoFx-YNm64Zgea8QYRo-kHHf3Vht04mYBQ",
    skylink: "_A1WQyJk2lwioirt-8_qrEG94jOT5D3RImMHDtq7dbfr7A",
    skylinks: [{ skylink: "_A1WQyJk2lwioirt-8_qrEG94jOT5D3RImMHDtq7dbfr7A" }],
    metadata: {
      name: "SkyTransfer",
      description: "Decentralized open source file sharing platform.",
      themeColor: "#000000",
      icon: "/assets/skytransfer-promo.jpg",
    },
  },
  {
    resolverSkylink: "AQDikuO5szw9nTHZvvm0jT_iwRIJ74UqyvReNwHePAkqBQ",
    skylink: "GABvY0s2-FuyKHtvm90KCVTUvg-NvQJrYdQ7XG8NNqcPYg",
    skylinks: [{ skylink: "GABvY0s2-FuyKHtvm90KCVTUvg-NvQJrYdQ7XG8NNqcPYg" }],
    metadata: {
      name: "SkySend",
      description: "An open source, highly secure, private and decentralized way to send and share your files.",
      themeColor: "#57B560",
      icon: "/resources/icon/android-chrome-192x192.png",
    },
  },
  {
    resolverSkylink: "AQBLTOv9uMFcNR_NRooBc6Rv7jb4it1cozkWEApU3roLEQ",
    skylink: "EABFLP0a9mYcPaRIhuTj9kqp0p-5vwmr1gWtXOVWBNORwA",
    skylinks: [{ skylink: "EABFLP0a9mYcPaRIhuTj9kqp0p-5vwmr1gWtXOVWBNORwA" }],
    metadata: {
      name: "Rift",
      description: "Your decentralized workspace",
      themeColor: "#ffffff",
      icon: "/android-chrome-192x192.png",
    },
  },
  // {
  //   resolverSkylink: "AQDn5uriOXZFLumP0QhJUO7D3kPkJ2SPciJCiShDnXb1Dw",
  //   skylink: "_AFA8eHudO8vU10GdgSjvX_40P2gXJsIq5jZY2VoBiVQmg",
  //   skylinks: [{ skylink: "_AFA8eHudO8vU10GdgSjvX_40P2gXJsIq5jZY2VoBiVQmg" }],
  //   metadata: {
  //     name: "Hacker Paste",
  //     description:
  //       "Hacker Paste lets you share encrypted text and code snippets through Skynet, a decentralized content delivery network.",
  //     themeColor: "#ffffff",
  //     icon: "/static/android-chrome-192x192.png",
  //   },
  // },
];

export default function StorageContextProvider({ children }) {
  const { mySky, user } = React.useContext(AuthContext);
  const [state, setState] = React.useState(initialState);
  const { dapps, isStorageProcessing } = state;

  const refreshStorage = React.useCallback(async () => {
    try {
      const { data: response } = await mySky.getJSON(`${dataDomain}/dapps`);

      if (response) {
        const data = schema.current.Schema.cast(response);

        // TODO: will need migration here instead of dropping all previous data
        if (!schema.current.Schema.isValidSync(data)) {
          throw new Error("/dapps response does not match current data schema");
        }

        setState((state) => ({ ...state, isStorageInitialised: true, dapps: data.elements }));
      } else {
        // seed the storage with default apps

        setState((state) => ({ ...state, isStorageProcessing: true }));

        const data = schema.current.Schema.cast({ elements: defaultDapps });
        const dapps = data.elements;

        await mySky.setJSON(`${dataDomain}/dapps`, data);

        setState((state) => ({ ...state, isStorageInitialised: true, isStorageProcessing: false, dapps }));

        toast.info(signUpMessage, {
          autoClose: 60000,
          hideProgressBar: true,
          progress: undefined,
          position: "top-center",
          className: "bg-blue-100",
        });
      }
    } catch (error) {
      console.log(error.message);

      // server error or invalid schema
      setState((state) => ({ ...state, isStorageInitialised: true, isStorageProcessing: false, dapps: [] }));
    }
  }, [mySky, setState]);

  const persistStorage = React.useCallback(
    async (dapps) => {
      try {
        const data = schema.current.Schema.cast({ elements: dapps });

        await mySky.setJSON(`${dataDomain}/dapps`, data);

        setState((state) => ({ ...state, dapps: data.elements }));
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
    async (data) => {
      if (isStorageProcessing) {
        toast.error(storageConsistencyMessage);
        return;
      }

      setState((state) => ({ ...state, isStorageProcessing: true }));

      // cast data into a dapp schema
      const dapp = schema.current.DappSchema.cast(data);

      const index = dapps.findIndex(({ id }) => data.id === id);

      // add skylink to skylinks collection if it didn't exist yet
      if (!dapp.skylinks.find(({ skylink }) => skylink === dapp.skylink)) {
        dapp.skylinks.push({ skylink: dapp.skylink });
      }

      if (index === -1) {
        await persistStorage([...dapps, dapp]);
      } else {
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
