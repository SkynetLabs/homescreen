import ky from "ky";
import { getMetadata } from "page-metadata-parser";
import ogs from "open-graph-scraper-lite";

const emptyManifest = {
  name: "Not Found",
  icon: null,
  description: "No description found.",
  theme_color: "#000000",
  manifestFound: false,
};

export default async function getSkappMetadata(url) {
  try {
    // setup vars
    let parsedManifest = {};
    let parsedMetadata = {};

    let skylink;
    let response;

    try {
      // Get HTML of skylink
      // TODO: replace with client.getFileContent() for registry verification on resolver skylinks
      response = await ky.get(url);
    } catch (error) {
      console.error(error);
      console.error("No manifest file found.");
    }

    // Grab HTML and parse. Used to find manifest URL and metadata.
    const responseText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(responseText, "text/html");

    // grab immutable skylink
    // TODO: Grab this from the client.getFileContent() above.
    for (var key of response.headers.keys()) {
      if (key === "skynet-skylink") {
        skylink = response.headers.get(key);
      }
    }

    // Check HTML for reference to manifest file
    try {
      // Find Link tags
      const links = doc.getElementsByTagName("link");

      // find <link rel="manifest" />
      let manifestLocation = "";
      for (let link of links) {
        let rel = link.getAttribute("rel");
        if (rel === "manifest") {
          manifestLocation = link.getAttribute("href");
        }
      }
      if (!manifestLocation) throw new Error("No manifest declared.");

      // Build full path with SkylinkUrl
      const manifestUrl = new URL(manifestLocation, url);

      // Get Manifest file
      // May replace by getting with SkynetClient.getFileContent() if it validates resolver proof.
      const manifest = await ky.get(manifestUrl.href).json();

      // Get directory of manifest file for parseManifest since references are relative.
      const manifestDir = manifestUrl.href.substring(0, manifestUrl.href.lastIndexOf("/")) + "/";

      // parse the manifset file, grabbing best key-values
      parsedManifest = parseManifest(manifest, manifestDir);
    } catch (error) {
      console.error(error);
      console.error("No manifest file found.");
    }

    // if missing or incomplete manifest...
    if (!parsedManifest.manifestFound) {
      // parse metadata using body text and parsed html.
      parsedMetadata = await parseMetadata(responseText, doc, url);
    }

    // combine results from parsers, with Manifest taking priority
    const data = { ...emptyManifest, ...parsedMetadata, ...parsedManifest, skylink };

    return data;
  } catch (error) {
    console.error(error);

    return emptyManifest;
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
