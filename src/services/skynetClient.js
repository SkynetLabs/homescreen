import { SkynetClient } from "skynet-js";

export default new SkynetClient(window.location.hostname === "localhost" ? "https://dev1.siasky.dev" : undefined);
