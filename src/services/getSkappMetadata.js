import ky from "ky";
import { getMetadata } from "page-metadata-parser";
import ogs from "open-graph-scraper-lite";
import skynetClient from "../services/skynetClient";
import prettyBytes from "pretty-bytes";

const emptyManifest = {
  name: "Not Found",
  icon: null,
  description: "No description found.",
  theme_color: "#000000",
  manifestFound: false,
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

export default async function getSkappMetadata(skylink) {
  const skynetMetadata = await getSkynetMetadata(skylink);

  try {
    const skylinkUrl = await skynetClient.getSkylinkUrl(skylink, { subdomain: true });
    const response = await ky.get(skylinkUrl);
    const contentType = response.headers.get("content-type");

    if (contentType !== "text/html") {
      return { ...emptyManifest, ...skynetMetadata };
    }

    // Get HTML of skylink
    // TODO: replace with client.getFileContent() for registry verification on resolver skylinks

    // Grab HTML and parse. Used to find manifest URL and metadata.
    const responseText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(responseText, "text/html");

    // Find Link tags
    const manifestTag = Array.from(doc.getElementsByTagName("link")).find(
      (link) => link.getAttribute("rel") === "manifest"
    );

    if (!manifestTag) throw new Error("No manifest declared.");

    const manifestPath = manifestTag.getAttribute("href");
    const { data: manifest } = await skynetClient.getFileContent(skylink, { subdomain: true, path: manifestPath });

    // Get directory of manifest file for parseManifest since references are relative.
    const manifestUrl = await skynetClient.getSkylinkUrl(skylink, { subdomain: true, path: manifestPath });
    const manifestUrlBase = manifestUrl.replace(/\/[^/]+$/, "/");

    // parse the manifset file, grabbing best key-values
    const parsedManifest = parseManifest(manifest, manifestUrlBase);

    let parsedMetadata = {};

    // if missing or incomplete manifest...
    if (!parsedManifest.manifestFound) {
      // parse metadata using body text and parsed html.
      parsedMetadata = await parseMetadata(responseText, doc, skylinkUrl);
    }

    // combine results from parsers, with Manifest taking priority
    return { ...emptyManifest, ...skynetMetadata, ...parsedMetadata, ...parsedManifest, skylink };
  } catch (error) {
    console.error(error);

    return { ...emptyManifest, ...skynetMetadata };
  }
}

// Use a manifest file json to fill out required Skapp Data
function parseManifest(manifest, url) {
  // Choose a definitive set of properties used in frontend
  const chosenName = manifest.short_name || manifest.name || undefined;
  const description = manifest.description || undefined;
  const theme_color = manifest.theme_color || undefined;
  const icon = manifest.icons[0].src || manifest.iconPath || undefined;
  const iconUrl = icon ? new URL(url + icon) : undefined;

  // if not all found, manifest is incomplete, flag as "false"
  const manifestFound = chosenName && description && theme_color && icon && iconUrl ? true : false;

  const parsed = { name: chosenName, icon: iconUrl, description, theme_color, manifestFound };

  // return parsed after removing undefined keys.
  return JSON.parse(JSON.stringify(parsed));
}

// Use index.html metadata fields to fill out missing Skapp Data
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

  // Haven't found usecase to test.
  console.log(og);
  console.log(md);

  const name = og.ogTitle || md.title || undefined;
  const icon = ogImage || md.icon || md.image || undefined;
  const description = og.ogDescription || md.description || undefined;
  const theme_color = og.themeColor || undefined;

  const parsed = { name, icon, description, theme_color };

  // return parsed after removing undefined keys.
  return JSON.parse(JSON.stringify(parsed));
}
