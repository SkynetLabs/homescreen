import ky from "ky-universal";
import { getMetadata } from "page-metadata-parser";
import ogs from "open-graph-scraper-lite";
import skynetClient from "../services/skynetClient";
import prettyBytes from "pretty-bytes";
import { get } from "lodash-es";

const emptyManifest = {
  name: "Not Found",
  icon: null,
  description: "No description found.",
  themeColor: "#000000",
};

async function getSkynetMetadata(skylink) {
  try {
    const response = await skynetClient.getMetadata(skylink);
    const { filename, length, subfiles } = response.metadata;
    const metadata = { name: filename, description: prettyBytes(length) };

    if (subfiles && filename in subfiles) {
      const { contenttype } = subfiles[filename];

      metadata.description = `${contenttype} - ${metadata.description}`;
    }

    return metadata;
  } catch (error) {
    console.error(error);

    return {};
  }
}

export default async function getDappMetadata(skylink) {
  const skynetMetadata = await getSkynetMetadata(skylink);

  try {
    const skylinkUrl = await skynetClient.getSkylinkUrl(skylink, { subdomain: true });
    const contentType = (await ky.head(skylinkUrl)).headers.get("content-type");

    if (contentType !== "text/html") {
      return { ...emptyManifest, ...skynetMetadata };
    }

    // Get HTML of skylink
    // TODO: replace with client.getFileContent() for registry verification on resolver skylinks

    // Grab HTML and parse. Used to find manifest URL and metadata.
    const responseText = await ky.get(skylinkUrl).text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(responseText, "text/html");

    // Find Link tags
    const manifestTag = Array.from(doc.getElementsByTagName("link")).find(
      (link) => link.getAttribute("rel") === "manifest"
    );

    if (!manifestTag) throw new Error(`${skylink}: no manifest declared`);

    const manifestPath = manifestTag.getAttribute("href");
    const { data: manifest } = await skynetClient.getFileContent(skylink, { subdomain: true, path: manifestPath });

    // Get directory of manifest file for parseManifest since references are relative.
    const manifestUrl = await skynetClient.getSkylinkUrl(skylink, { subdomain: true, path: manifestPath });

    // parse the manifset file, grabbing best key-values
    const parsedManifest = parseManifest(manifest, manifestUrl);

    // parse metadata using body text and parsed html.
    const parsedMetadata = await parseMetadata(responseText, doc, skylinkUrl);

    // combine results from parsers, with Manifest taking priority
    return { ...emptyManifest, ...skynetMetadata, ...parsedMetadata, skylink, ...parsedManifest };
  } catch (error) {
    console.error(error.message);

    return { ...emptyManifest, ...skynetMetadata };
  }
}

const cleanSkylink = (skylink) => {
  if (!skylink) return skylink;
  return skylink.replace("sia://", "");
};

// Use a manifest file json to fill out required Dapp Data
function parseManifest(manifest, manifestUrl) {
  // Choose a definitive set of properties used in frontend
  const chosenName = manifest.short_name || manifest.name || undefined;
  const description = manifest.description || undefined;
  const themeColor = manifest.theme_color || undefined;
  const icon = get(manifest.icons, ["0", "src"]) || manifest.iconPath || undefined;
  const iconUrl = icon ? new URL(icon, manifestUrl).pathname : undefined;
  const skylink = cleanSkylink(manifest.skylink) || undefined;
  const skynetMetadata = manifest.skynet_metadata || undefined;

  // return parsed after removing undefined keys.
  return JSON.parse(JSON.stringify({ name: chosenName, icon: iconUrl, description, themeColor, skylink, skynetMetadata }));
}

// Use index.html metadata fields to fill out missing Dapp Data
async function parseMetadata(html, doc, url) {
  const { result: og } = await ogs({
    html,
    customMetaTags: [
      {
        multiple: false,
        property: "theme-color",
        fieldName: "themeColor",
      },
    ],
  });

  // const doc = new Document(html);
  const md = getMetadata(doc, url);
  const ogImage = og.ogImage ? new URL(og.ogImage.url, url) : undefined;
  const name = og.ogTitle || md.title || undefined;
  const icon = ogImage || md.icon || md.image || undefined;
  const description = og.ogDescription || md.description || undefined;
  const themeColor = og.themeColor || undefined;

  // return parsed after removing undefined keys.
  return JSON.parse(JSON.stringify({ name, icon, description, themeColor }));
}
