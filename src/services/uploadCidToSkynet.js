import ky from "ky";
import skynetClient from "./skynetClient";
// import prettyBytes from "pretty-bytes";
import { toast } from "react-toastify";
import untar from "js-untar-lhc";

export default async function uploadCidToSkynet(cid) {
  const urlStart = "https://ipfs.infura.io:5001/api/v0/get?arg=";
  const urlEnd = "&archive=true";

  const ipfsTarUrl = urlStart + cid + urlEnd;

  let id = toast.loading("Getting IPFS data...");

  // IPFS using X-Content-Length header instead of Content-Length?
  // const onDownloadProgress = (progress, chunk) => {
  //   console.log(progress);
  //   toast.update(id, { progress });
  // };

  const response = await ky.get(ipfsTarUrl);
  const buffer = await response.arrayBuffer();

  toast.update(id, { render: "Extracting IPFS archive..." });

  let uploadDir = "";

  let dirName = "";

  await untar(buffer).then((extractedFiles) => {
    uploadDir = extractedFiles.reduce((accumulator, file) => {
      // console.log(file);
      // const path = getRelativeFilePath(file);

      if (!file.name.includes("/")) {
        dirName = file.name;
        return { ...accumulator };
      }

      const relativePath = file.name.substring(dirName.length + 1);
      const fileObj = new File([file.buffer], relativePath);

      return { ...accumulator, [relativePath]: fileObj };
    }, {});
  });

  let result = [];
  try {
    toast.update(id, { render: "Uploading to Skynet...", progress: 0.0 });
    const onUploadProgress = (progress, { loaded, total }) => {
      // console.info(`Progress ${Math.round(progress * 100)}%`);
      toast.update(id, { progress });
    };

    const { skylink } = await skynetClient.uploadDirectory(uploadDir, dirName, { onUploadProgress });
    const skylinkUrl = await skynetClient.getSkylinkUrl(skylink, { subdomain: true });

    result = [skylink, skylinkUrl];
    // console.log(skylink);
    // toast.update(id, { render: "Uploaded to Skynet", type: "success", isLoading: false, autoClose: 3000 });
    // toast.done(id);
  } catch (error) {
    console.error(error);
  }

  return result;
}
