import { SkynetClient } from "skynet-js";

export default new SkynetClient(
  window.location.hostname === "localhost" ? process.env.REACT_APP_PORTAL_URL ?? "https://siasky.net" : undefined
);
