import { parseSkylink, convertSkylinkToBase64 } from "skynet-js";
import { trim } from "lodash";
import skynetClient from "./skynetClient";
import ky from "ky-universal";

const SKYLINK_BASE_32_MATCHER = /^(sia:\/\/)?(?<skylink>[a-z0-9_-]{55})(\/.*)?/;
const HNS_DOMAIN_MATCHER = /^(https?:\/\/)?(?<domain>[^.]+)\.hns/;
const ETH_DOMAIN_MATCHER = /^(https?:\/\/)?(?<domain>[^.]+)\.eth/;
const IPFS_CID_MATCHER = /^\/?ipfs(:\/)?\/(?<cid>[a-zA-Z0-9_-]{46,})/;
const SKYLINK_DNSLINK_MATCHER = /dnslink=\/skynet-ns\/(?<skylink>[a-zA-Z0-9_-]{46,})/;
const IPFS_DNSLINK_MATCHER = /dnslink=\/ipfs\/(?<cid>[a-zA-Z0-9_-]{46,})/;
const IPNS_DNSLINK_MATCHER = /dnslink=\/ipns\/(?<name>.+)/;

const ipfsApi = "https://misc.siasky.net/ipfs";

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

    try {
      const dns = await ky.get(`${ipfsApi}/eth/dns-query/${groups.domain}.eth`).json();
      const records = dns.Answer.map(({ data }) => trim(data, '"'));

      // try and match skynet dnslink
      const matchSkylinkDnslink = records.find((record) => record.match(SKYLINK_DNSLINK_MATCHER));
      if (matchSkylinkDnslink) return matchSkylinkDnslink.groups.skylink;

      // try and match ipfs dnslink
      const matchIpfsDnslink = records.find((record) => record.match(IPFS_DNSLINK_MATCHER));
      if (matchIpfsDnslink) return migrateIpfsToSkylink(matchSkylinkDnslink.groups.cid);

      // try and match ipfs dnslink
      const ipnsDnslink = records.find((record) => record.match(IPNS_DNSLINK_MATCHER));
      if (ipnsDnslink) {
        try {
          const match = ipnsDnslink.match(IPNS_DNSLINK_MATCHER);
          const response = await ky.post(`${ipfsApi}/api/v0/name/resolve?arg=${match.groups.name}`).json();
          const matchIpfsCid = response.Path.match(IPFS_CID_MATCHER);
          return migrateIpfsToSkylink(matchIpfsCid.groups.cid);
        } catch {
          // do nothing
        }
      }
    } catch {
      return; // do nothing
    }
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
    // TODO: should we support ipfs endpoint on production portals ?
    const timeout = 5 * 60 * 1000; // 5 minutes
    const { skylink } = await ky.get(`${ipfsApi}/migrate/${cid}`, { timeout }).json();

    if (skylink) return skylink;
  } catch {
    return null;
  }
}
