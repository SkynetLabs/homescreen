import { SkynetClient } from "skynet-js";

export const skynetClient = new SkynetClient(
  window.location.hostname === "localhost" ? process.env.REACT_APP_PORTAL_URL ?? "https://siasky.net" : undefined
);
export const dataDomain = "homescreen.hns";
export const mySky = await skynetClient.loadMySky(dataDomain);
