import { SkynetClient } from "skynet-js";

export default new SkynetClient(window.location.hostname === "localhost" ? "https://siasky.net" : undefined);
