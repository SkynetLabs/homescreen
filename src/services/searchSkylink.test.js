import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import searchSkylink from "./searchSkylink";

enableFetchMocks();

const hnsDomain = "bitcoin-whitepaper";
const skylink = "3ACpC9Umme41zlWUgMQh1fw0sNwgWwyfDDhRQ9Sppz9hjQ";
const skylinkBase32 = "rg0ai2ul4qcusdeeama81h11qnu39c6s41dgp7oc718k7l59ksvm338";
const testCases = [
  // valid base64 skylinks
  [skylink],
  [`sia://${skylink}`],
  [`${skylink}/path/to/file`],
  [`sia://${skylink}/path/to/file`],
  // valid base32 skylinks
  [skylinkBase32],
  [`sia://${skylinkBase32}`],
  [`${skylinkBase32}/path/to/file`],
  [`sia://${skylinkBase32}/path/to/file`],
  // valid base64 skylink urls
  [`https://siasky.net/${skylink}`],
  [`https://siasky.net/${skylink}/`],
  [`https://siasky.net/${skylink}/path/to/file`],
  [`https://example.com/${skylink}`],
  [`https://example.com/${skylink}/`],
  [`https://example.com/${skylink}/path/to/file`],
  // valid base32 skylink urls
  [`https://siasky.net/${skylinkBase32}`],
  [`https://siasky.net/${skylinkBase32}/`],
  [`https://siasky.net/${skylinkBase32}/path/to/file`],
  [`https://example.com/${skylinkBase32}`],
  [`https://example.com/${skylinkBase32}/`],
  [`https://example.com/${skylinkBase32}/path/to/file`],
  // valid base32 skylink subdomain urls
  [`https://${skylinkBase32}.siasky.net`],
  [`https://${skylinkBase32}.siasky.net/`],
  [`https://${skylinkBase32}.siasky.net/path/to/file`],
  [`https://${skylinkBase32}.example.com`],
  [`https://${skylinkBase32}.example.com/`],
  [`https://${skylinkBase32}.example.com/path/to/file`],
  // hns domain
  [`${hnsDomain}.hns`],
  [`https://${hnsDomain}.hns.siasky.net`],
  [`https://${hnsDomain}.hns.siasky.net/`],
  [`https://${hnsDomain}.hns.siasky.net/path/to/file`],
  [`https://${hnsDomain}.hns.example.com`],
  [`https://${hnsDomain}.hns.example.com/`],
  [`https://${hnsDomain}.hns.example.com/path/to/file`],
  [`https://${hnsDomain}.hns.to`],
  [`https://${hnsDomain}.hns.to/`],
  [`https://${hnsDomain}.hns.to/path/to/file`],
  // dnslink
  [`https://bitcoin-whitepaper.com`],
  [`https://bitcoin-whitepaper.com/`],
  [`https://bitcoin-whitepaper.com/path/to/file`],
  // ens
  [`bitcoin-whitepaper.eth`],
  [`bitcoin-whitepaper.eth/`],
  [`bitcoin-whitepaper.eth/path/to/file`],
  // enslink
  [`https://bitcoin-whitepaper.eth.link`],
  [`https://bitcoin-whitepaper.eth.link/`],
  [`https://bitcoin-whitepaper.eth.link/path/to/file`],
];

beforeEach(() => {
  fetchMock.mockIf(/^https?:\/\//, () => {
    return Promise.resolve({ status: 204, headers: { "Skynet-Skylink": skylink } });
  });
});

test.each(testCases)("input '%s' should resolve to a skylink", async (input) => {
  expect(await searchSkylink(input)).toBe(skylink);
});
