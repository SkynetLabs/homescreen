import { parseSkylink, convertSkylinkToBase64 } from "skynet-js";
import skynetClient from "./skynetClient";
import ky from "ky-universal";

const SKYLINK_BASE_32_MATCHER = /^(sia:\/\/)?(?<skylink>[a-z0-9_-]{55})(\/.*)?/;
const HNS_DOMAIN_MATCHER = /^(https?:\/\/)?(?<domain>[^.]+)\.hns/;
const ETH_DOMAIN_MATCHER = /^(https?:\/\/)?(?<domain>[^.]+)\.eth/;
const IPFS_CID_MATCHER = /^ipfs:\/\/(?<cid>[a-zA-Z0-9_-]{46})/;

export default async function searchSkylink(input) {
  try {
    const parsed = parseSkylink(input);

    if (parsed) return parsed;
  } catch {
    // nothing to do
  }

  try {
    const parsed = parseSkylink(input, { fromSubdomain: true });

    if (parsed) return convertSkylinkToBase64(parsed);
  } catch {
    // nothing to do
  }

  if (input.match(SKYLINK_BASE_32_MATCHER)) {
    const { groups } = input.match(SKYLINK_BASE_32_MATCHER);

    return convertSkylinkToBase64(groups.skylink);
  }

  if (input.match(HNS_DOMAIN_MATCHER)) {
    const { groups } = input.match(HNS_DOMAIN_MATCHER);
    const address = await skynetClient.getHnsUrl(groups.domain);
    const skylink = await requestSkylink(address);

    if (skylink) return skylink;
  }

  if (input.match(ETH_DOMAIN_MATCHER)) {
    const { groups } = input.match(ETH_DOMAIN_MATCHER);
    const skylink = await requestSkylink(`https://${groups.domain}.eth.link`);

    if (skylink) return skylink;
  }

  // any arbitrary url
  if (input.startsWith("https://")) {
    const skylink = await requestSkylink(input);

    if (skylink) return skylink;
  }

  if (input.match(/^[^./]+$/)) {
    const address = await skynetClient.getHnsUrl(input);
    const skylink = await requestSkylink(address);

    if (skylink) return skylink;
  }

  if (input.match(IPFS_CID_MATCHER)) {
    const { groups } = input.match(IPFS_CID_MATCHER);
    const skylink = migrateIpfsToSkylink(groups.cid);

    if (skylink) return skylink;
  }

  return null;
}

async function requestSkylink(address) {
  try {
    const response = await ky.head(address);
    const skylink = response.headers.get("skynet-skylink");

    if (skylink) return skylink;
  } catch {
    return null;
  }
}

async function migrateIpfsToSkylink(cid) {
  try {
    // replace dev1 with something else at some point huh
    const { skylink } = await ky.get(`https://dev1.siasky.dev/ipfs/migrate/${cid}`).json();

    if (skylink) return skylink;
  } catch {
    return null;
  }
}
